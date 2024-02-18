import React from "react";
import PropTypes from "prop-types";
import { readdirSync } from "fs";
import path, { join } from "path";

import isVideoFile from "../tools/is-video-file";
import VideoFile from "./VideoFile";
import { getCleanName } from "../tools/file";
import { Row } from "antd";

function listFilesRecursively(folderPath) {
  const files = {};
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

const FileBrowser = ({ folder }) => {
  if (!folder) {
    return <div>No folder</div>;
  }
  const { videos } = listFilesRecursively(folder);

  return (
    <div className="file-browser">
      <Row gutter={[0, 0]} className="listing">
        {videos.map((dirent) => (
          <VideoFile key={dirent.fullPath} dirent={dirent} />
        ))}
      </Row>
    </div>
  );
};

FileBrowser.propTypes = {
  folder: PropTypes.string,
  openFolder: PropTypes.func,
};

FileBrowser.defaultProps = {
  folder: "",
  openFolder: () => null,
};

export default FileBrowser;
