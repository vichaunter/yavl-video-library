import { readdirSync } from "fs";
import path, { join } from "path";

import { getCleanName } from "./tools/file";
import isVideoFile from "./tools/is-video-file";

export const filterNoNamedLanguages = (languages) =>
  languages.filter((stream) => stream.language);

export function listFilesRecursively(folderPath) {
  const files: Record<string, any> = {};
  files.videos = [];

  for (const entry of readdirSync(folderPath, { withFileTypes: true })) {
    const fullPath = join(folderPath, entry.name);
    const pathArray = fullPath.split(path.sep);
    const altTitle = getCleanName(pathArray[pathArray.length - 2], true);

    if (entry.isDirectory()) {
      const subFolderPath = join(folderPath, entry.name);
      const subFolderFiles = listFilesRecursively(subFolderPath);
      files.videos.push(...subFolderFiles.videos);
    } else if (entry.isFile() && isVideoFile(entry.name)) {
      files.videos.push({ ...entry, fullPath, altTitle });
    }
  }

  return files;
}
