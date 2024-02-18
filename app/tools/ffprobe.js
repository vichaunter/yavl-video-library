import { execFile } from "child_process";
import path from "path";

import { remote } from "electron";
import { getCleanName, getYear } from "./file";
import Semaphore from "./semaphore";

// Get the directory of the running Electron app
const appDirectory = remote.app.getAppPath();

const ffprobeBinName = process.platform === "win32" ? "ffprobe.exe" : "ffprobe";
const ffprobeBinaryPath = path.join(appDirectory, "bin", ffprobeBinName);

const semaphore = new Semaphore(1);

function ffprobeExecFile(...args) {
  return new Promise((resolve, reject) => {
    execFile(ffprobeBinaryPath, args, (err, stdout, stderr) => {
      if (err) {
        if (err.code === "ENOENT") {
          reject(err);
        } else {
          const ffprobeErr = new Error(stderr.split("\n").pop());
          reject(ffprobeErr);
        }
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
}

export const VideoResolution = {
  SD: "SD",
  HDTV_720: "720",
  HDTV_1080: "1080",
  UHDTV_2K: "2K",
  UHDTV_4K: "4K",
  UHDTV_8K: "8K",
};

// https://kodi.wiki/view/Naming_video_files/Movies
// https://davidwalsh.name/detect-video-resolution
// https://kodi.wiki/view/Media_flags
// https://blog.chameleondg.com/
// https://github.com/cisco-open-source/kodi/tree/master/addons/skin.confluence/media/flagging/video
function getVideoQuality(width) {
  if (!width || width < 1000) {
    return VideoResolution.SD;
  }
  if (width < 1800) {
    return VideoResolution.HDTV_720;
  }
  if (width < 2000) {
    return VideoResolution.HDTV_1080;
  }
  if (width < 3000) {
    return VideoResolution.UHDTV_2K;
  }
  if (width < 7000) {
    return VideoResolution.UHDTV_4K;
  }
  return VideoResolution.UHDTV_8K;
}

function getAudioResume(streams) {
  return streams
    .filter((stream) => stream.codec_type === "audio")
    .map((stream) => ({
      codecName: stream.codec_name || "",
      codecLongName: stream.codec_long_name || "",
      channelLayout: stream.channel_layout || "",
      language: stream.tags?.language || "",
    }));
}

function getSubtitleResume(streams) {
  return streams
    .filter((stream) => stream.codec_type === "subtitle")
    .map((stream) => ({
      language: stream.tags?.language || "",
      title: stream.tags?.title || "",
    }));
}

function resumeResponse(response) {
  const { format, streams } = response;

  const video = streams
    .filter(
      (stream) => stream.codec_type === "video" && stream.codec_name !== "mjpeg"
    )
    .shift();

  if (!video) {
    throw new Error("Video stream is missing");
  }

  const filename = path.basename(format.filename);

  return {
    fullpath: format.filename,
    filename,
    title: getCleanName(filename),
    year: getYear(filename),
    width: video.width,
    height: video.height,
    size: parseInt(format.size, 10),
    duration: parseFloat(format.duration),
    quality: getVideoQuality(video.width),
    codecName: video.codec_name,
    codecLongName: video.codec_long_name,
    formatName: format.format_name,
    formatLongName: format.format_long_name,
    audio: getAudioResume(streams),
    subtitle: getSubtitleResume(streams),
  };
}

export default async function extractVideoInformations(source) {
  const release = await semaphore.acquire();
  try {
    const response = await ffprobeExecFile(
      "-show_streams",
      "-show_format",
      "-print_format",
      "json",
      source
    );
    release();
    return resumeResponse(response);
  } catch (e) {
    release();
    throw e;
  }
}
