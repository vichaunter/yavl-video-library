import PropTypes from "prop-types";
import React from "react";

import { Row } from "antd";
import { listFilesRecursively } from "../helpers";
import VideoFile from "./VideoFile";

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
