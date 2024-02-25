import fs from 'fs';
import path from 'path';
import { FFprobeOutput } from './types';

const extensions = ['mp4', 'avi', 'mkv'];

const isVideoFile = (file: string) => {
  const re = new RegExp(`.(${extensions.join('|')})$`, 'i');
  return !!file.match(re);
};

export function removeExtension(file: string) {
  return file.slice(0, -path.extname(file).length);
}

const INVALID = [
  'atomixhq art',
  'pelicula para',
  'atomohd casa',
  'atomod cash',
  'atomixhq one',
  'atomixhq net',
  'atomohd cc',
  'atomohd surf',
  'atomohd ninja',
  'atomohd eu',
  'atomohd plus',
  'atomohd tw',
  'descargas2020 org',
  '4Krip2160 pctfenix com',
  'pctfenix com',
  'BDR1080',
  'BD1080',
  'M1080',
  '4Krip2160',
  'v ex',
  'parte 1',
  'parte 2',
  'microhd',
  '4k2160',
  'ESDLA',
  'dvdrip',
  'dvd',
  'cd1',
  'cd2',
  'pctmix1',
  'pctfenix',
  'pctreload1',
  'pctnew',
  'pctmix',
  'newpct1 com',
  'newpct1',
  'newpct com',
  'newpct',
  'atomixhq',
  'atomohd',
  'descargas2020',
  '4Kremux2160',
  'link',
  'xvid',
];

export function getCleanName(filename: string, isPath?: boolean) {
  if (isPath) filename = filename + '.path';
  let standard = filename.match(/(.*)\.\(?\d{4}\)?\./); // https://en.wikipedia.org/wiki/Standard_(warez)
  if (!standard) {
    standard = filename.match(/(.*) \(\d{4}\)/); // variant like "Name (date) tags.ext"
  }
  const source = standard ? standard[1] : removeExtension(filename);
  const invalidRegex = new RegExp(INVALID.join('|'), 'gi');

  return (
    source
      .replace(/\[[^\]]+\]/g, ' ') // remove content in brackets
      .replace(/\([^)]+\)/g, ' ') // remove content in parenthesis
      .replace(/www\.(?:\w+\.)(com|org|net|cash|link)/gi, '') //remove urls
      .replace(/\.com/, '')
      .replace(/\./g, ' ')
      .replace(invalidRegex, '')
      .replace(/(^\s*\d{4}\s*-)|(-\s*\d{4}\s*$)/, '') // remove starting or ending date (2018 - XXX) or (XXX - 2018)
      .replace(/\s+/, ' ')
      // .replace(/([A-Z])/g, ' $1')
      .trim()
  );
}

export type Media = {
  fullPath: string;
  cleanName: string;
  name: string;
};

export async function listFilesRecursively(
  folderPath: string,
): Promise<Media[]> {
  const videos: Media[] = [];

  for (const dirent of fs.readdirSync(folderPath, { withFileTypes: true })) {
    const fullPath = path.join(folderPath, dirent.name);
    const pathArray = fullPath.split(path.sep);
    const cleanName = getCleanName(pathArray[pathArray.length - 2], true);

    if (dirent.isDirectory()) {
      const subFolderPath = path.join(folderPath, dirent.name);
      const subFolderFiles = listFilesRecursively(subFolderPath);
      videos.push(...(await subFolderFiles));
    } else if (dirent.isFile() && isVideoFile(dirent.name)) {
      videos.push({ name: dirent.name, fullPath, cleanName } as any);
    }
  }

  return videos;
}

export function getYear(filename: string) {
  let match = filename.match(/.+\.\(?(\d{4})\)?\./); // https://en.wikipedia.org/wiki/Standard_(warez)
  if (!match) {
    match = filename.match(/.+\((\d{4})\).*/); // variant like "Name (date) tags.ext"
  }
  if (!match) {
    match = filename.match(/.+ - (\d{4}) - .+/); // variant like "Name - date - tags.ext"
  }
  if (match) {
    return match[1];
  }
  const name = removeExtension(filename)
    .replace(/\[[^\]]*]/g, ' ') // remove content in bracket
    .trim();
  const year = name.match(/^(\d{4})\s*-/) || name.match(/-\s*(\d{4})$/); // starting or ending date
  if (year) {
    return year[1];
  }
  return '';
}

export const VideoResolution = {
  SD: 'SD',
  HDTV_720: '720',
  HDTV_1080: '1080',
  UHDTV_2K: '2K',
  UHDTV_4K: '4K',
  UHDTV_8K: '8K',
};

// https://kodi.wiki/view/Naming_video_files/Movies
// https://davidwalsh.name/detect-video-resolution
// https://kodi.wiki/view/Media_flags
// https://blog.chameleondg.com/
// https://github.com/cisco-open-source/kodi/tree/master/addons/skin.confluence/media/flagging/video
export function getVideoQuality(width: number) {
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

export function getAudioResume(streams: FFprobeOutput['streams']) {
  return streams
    .filter((stream) => stream.codec_type === 'audio')
    .map((stream) => ({
      codecName: stream.codec_name || '',
      codecLongName: stream.codec_long_name || '',
      channelLayout: stream.channel_layout || '',
      language: stream.tags?.language || '',
    }));
}

export function getSubtitleResume(streams: FFprobeOutput['streams']) {
  return streams
    .filter((stream) => stream.codec_type === 'subtitle')
    .map((stream) => ({
      language: stream.tags?.language || '',
      title: stream.tags?.title || '',
    }));
}
