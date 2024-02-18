import React, { useEffect, useState } from "react";
import { basename } from "path";
import SoundOutlined from "@ant-design/icons/lib/icons/SoundOutlined";
import MessageOutlined from "@ant-design/icons/lib/icons/MessageOutlined";

import reduceFilename from "../tools/reduce-filename";
import extractVideoInformations from "../tools/ffprobe";
import Quality from "./Quality";
import Codec from "./Codec";
import Flag from "./Flag";
import searchOnTMDB from "../tools/tmdb";
import { ipcRenderer, shell } from "electron";
import { Col } from "antd";
import styled from "styled-components";
import { PlaySquareFilled } from "@ant-design/icons";
import notfoundSrc from "../images/flagging/notfound.jpg";
import db from "../services/db";
import store from "../services/store";

const trakticon = (
  <svg
    enableBackground="new 0 0 144.8 144.8"
    viewBox="0 0 144.8 144.8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m29.5 111.8c10.6 11.6 25.9 18.8 42.9 18.8 8.7 0 16.9-1.9 24.3-5.3l-40.4-40.3z"
      fill="#ed2224"
    />
    <path
      d="m56.1 60.6-30.6 30.5-4.1-4.1 32.2-32.2 37.6-37.6c-5.9-2-12.2-3.1-18.8-3.1-32.2 0-58.3 26.1-58.3 58.3 0 13.1 4.3 25.2 11.7 35l30.5-30.5 2.1 2 43.7 43.7c.9-.5 1.7-1 2.5-1.6l-48.3-48.3-29.3 29.3-4.1-4.1 33.4-33.4 2.1 2 51 50.9c.8-.6 1.5-1.3 2.2-1.9l-55-55z"
      fill="#ed2224"
    />
    <path
      d="m115.7 111.4c9.3-10.3 15-24 15-39 0-23.4-13.8-43.5-33.6-52.8l-36.7 36.6zm-41.2-44.6-4.1-4.1 28.9-28.9 4.1 4.1zm27.4-39.7-33.3 33.3-4.1-4.1 33.3-33.3z"
      fill="#ed1c24"
    />
    <path
      d="m72.4 144.8c-39.9 0-72.4-32.5-72.4-72.4s32.5-72.4 72.4-72.4 72.4 32.5 72.4 72.4-32.5 72.4-72.4 72.4zm0-137.5c-35.9 0-65.1 29.2-65.1 65.1s29.2 65.1 65.1 65.1 65.1-29.2 65.1-65.1-29.2-65.1-65.1-65.1z"
      fill="#ed2224"
    />
  </svg>
);
const StyledVideo = styled(Col)`
  position: relative;

  &:hover {
    .info {
      .extra {
        background-color: rgba(0, 0, 0, 0.8);
        .description {
          display: block;
          padding-bottom: 1rem;
        }
      }
    }
  }

  .info {
    height: 100%;

    .title {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 1.5rem;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0 1rem 1rem 0;
      color: white;
      padding: 0.35rem 1rem;
      span {
        font-size: 1rem;
      }
    }

    .extra {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 0.35rem 1rem;

      .description {
        color: white;
        display: none;
      }
    }
  }

  .cover {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  .trakt {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: transparent;
    padding: 0.4rem;
    cursor: pointer;

    svg {
      width: 2rem;
    }
  }

  .quality {
    img {
      width: 3rem;
      height: 2rem;
    }
  }

  .icon {
    color: white;
    padding-right: 1rem;
  }

  .play {
    color: white;
    position: absolute;
    z-index: 10;
    bottom: 0;
    right: 0;
    padding: 1rem;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const filterNoNamedLanguages = (languages) =>
  languages.filter((stream) => stream.language);

const renderAudio = (languages) => (
  <div className="languages audio">
    <SoundOutlined className="icon" />
    {languages.map((stream, idx) => (
      <Flag
        // eslint-disable-next-line react/no-array-index-key
        key={`${stream.language}_${stream.codecName}_${idx}`}
        language={stream.language}
        title={stream.codecName}
      />
    ))}
  </div>
);

const renderSubtitle = (languages) => (
  <div className="languages subtitle">
    <MessageOutlined className="icon" />
    {languages.map((stream, idx) => (
      <Flag
        // eslint-disable-next-line react/no-array-index-key
        key={`${stream.language}_${stream.title}_${idx}`}
        language={stream.language}
        title={stream.title}
      />
    ))}
  </div>
);

const renderInformations = (informations) => (
  <>
    <span className="title">
      {informations.title}{" "}
      <span>({informations?.tmdb?.release_date?.slice(0, 4)})</span>
    </span>
    <div className="extra">
      <div className="description">{informations?.tmdb?.overview}</div>
      <div className="audio">
        {informations.audio.length ? renderAudio(informations.audio) : null}
      </div>
      {informations.subtitle.length
        ? renderSubtitle(informations.subtitle)
        : null}
      <div className="quality">
        <Quality value={informations.quality} />
        <Codec value={informations.codecName} />
      </div>
    </div>
  </>
);

// eslint-disable-next-line camelcase
const renderCover = (informations) => (
  <img
    className="cover"
    alt={informations?.title}
    src={informations?.tmdb?.backdrop_path || notfoundSrc}
  />
);

const VideoFile = ({ dirent, onDoubleClick }) => {
  const [info, setInfo] = useState(null);
  const filePath = dirent.fullPath;

  useEffect(() => {
    const update = async () => {
      console.log(dirent);
      let info = await store.getMovieInfo(dirent.fullPath, dirent.altTitle);
      setInfo(info);
    };

    update();
  }, []);

  const handleOpenTraktr = () => {
    shell.openExternal(
      `https://trakt.tv/search?query=${info?.title?.split(" ").join("+")}`
    );
  };

  const handleOpenVideo = () => {
    ipcRenderer.send("open-file", dirent.fullPath);
  };

  const name = reduceFilename(basename(filePath));

  return (
    <StyledVideo xs={24} lg={12} xl={8} xxl={6} onDoubleClick={handleOpenVideo}>
      {renderCover(info)}
      <div className="info">
        {info ? renderInformations(info) : <span>{name}</span>}
        {info?.title && (
          <button className="trakt" onClick={handleOpenTraktr}>
            {trakticon}
          </button>
        )}
        <PlaySquareFilled className="play" onClick={handleOpenVideo} />
      </div>
    </StyledVideo>
  );
};

VideoFile.defaultProps = {
  filePath: "",
  onDoubleClick: () => null,
};

export default VideoFile;
