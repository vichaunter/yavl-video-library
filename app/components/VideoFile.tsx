import { basename } from "path";
import React, { useEffect, useState } from "react";

import { Col } from "antd";
import { ipcRenderer, shell } from "electron";
import styled from "styled-components";
import classNames from "classnames";
import { useWatchStore } from "../hooks/useHistory";
//@ts-ignore
import notfoundSrc from "../images/flagging/notfound.jpg";
import store, { MovieInfo } from "../services/store";
import reduceFilename from "../tools/reduce-filename";
import VideoInfo from "./VideoFile/VideoInfo";
import Watched from "./VideoFile/Watched";
import trakticon from "./icons/TraktIcon";

const StyledVideo = styled(Col)`
  position: relative;
  background-color: black;
  border: solid 1px #2d2d2d;

  .content {
    width: 100%;
    height: 100%;
    &.watched {
      opacity: 0.2;
    }
  }

  &:hover {
    .content {
      &.watched {
        opacity: 1;
      }
    }
    .info {
      .extra {
        background-color: rgba(0, 0, 0, 0.8);
        .description {
          font-size: 1.3rem;
          line-height: 1.6rem;
          background-color: rgba(0, 0, 0, 0.8);
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          min-height: 10rem;
          display: block;
          padding: 1rem;
          z-index: 100;
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

const Cover = ({ title, backdrop }) => (
  <img className="cover" alt={title} src={backdrop || notfoundSrc} />
);

const VideoFile = ({ dirent }) => {
  const [info, setInfo] = useState<MovieInfo>();
  const filePath = dirent.fullPath;
  const [history, toggleWatched] = useWatchStore((state) => [
    state.history,
    state.toggleWatched,
  ]);

  useEffect(() => {
    const update = async () => {
      store.getMovieInfo(dirent.fullPath, dirent.altTitle).then((data) => {
        data && setInfo(data);
      });
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

  const handleToggleWatched = () => info?.title && toggleWatched(info?.title);

  if (!info?.title || !info) return <StyledVideo>Missing info</StyledVideo>;

  const name = reduceFilename(basename(filePath));
  const watched = history[info?.title ?? ""];

  return (
    <StyledVideo xs={24} lg={12} xl={8} xxl={6} onDoubleClick={handleOpenVideo}>
      <div className={classNames("content", { watched })}>
        <Cover title={info.title} backdrop={info?.tmdb?.backdrop_path} />
        <div className="info">
          <VideoInfo data={info} />
          <span>{name}</span>
          <button className="trakt" onClick={handleOpenTraktr}>
            {trakticon}
          </button>
          <Watched
            className="play"
            watched={watched}
            onClick={handleToggleWatched}
          />
          {/* <PlaySquareFilled className="play" onClick={handleOpenVideo} /> */}
        </div>
      </div>
    </StyledVideo>
  );
};

export default VideoFile;
