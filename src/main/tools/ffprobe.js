import { execFile } from 'child_process';
import path from 'path';

import { app } from 'electron';
import Semaphore from './semaphore';
import {
  getAudioResume,
  getCleanName,
  getSubtitleResume,
  getVideoQuality,
  getYear,
} from '../helpers';

// Get the directory of the running Electron app
const appDirectory = app.getAppPath();

const ffprobeBinName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
const ffprobeBinaryPath = path.join(appDirectory, 'bin', ffprobeBinName);

const semaphore = new Semaphore(1);

function ffprobeExecFile(...args) {
  return new Promise((resolve, reject) => {
    execFile(ffprobeBinaryPath, args, (err, stdout, stderr) => {
      if (err) {
        if (err.code === 'ENOENT') {
          reject(err);
        } else {
          console.error(stderr);
          reject();
          // const ffprobeErr = new Error(stderr.split('\n').pop());
          // reject(ffprobeErr);
        }
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
}

function resumeResponse(response) {
  const { format, streams } = response;

  const video = streams
    .filter(
      (stream) =>
        stream.codec_type === 'video' && stream.codec_name !== 'mjpeg',
    )
    .shift();

  if (!video) {
    throw new Error('Video stream is missing');
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

export function ffmpegSync(path) {
  return new Promise((resolve, reject) => {
    extractVideoInformations(path)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
}

export default async function extractVideoInformations(source) {
  // const release = await semaphore.acquire();
  try {
    const response = await ffprobeExecFile(
      '-show_streams',
      '-show_format',
      '-print_format',
      'json',
      source,
    );
    // release();

    return resumeResponse(response);
  } catch (e) {
    // release();
    throw e;
  }
}
