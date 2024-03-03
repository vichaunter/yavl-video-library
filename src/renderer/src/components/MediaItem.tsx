import { default as classNames, default as cn } from 'classnames';
import { FC, useState } from 'react';
import styled from 'styled-components';
import MediaModel from '../../../main/models/MovieModel';
import MediaItemFooter from './MediaItem/MediaItemFooter';

const StyledMedia = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  &:hover {
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
    z-index: 100;
    box-shadow: #777;
    transform: translateZ(10px);
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.5);
    .background {
      transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
      transform: scale(1.1);
    }
  }

  .content {
    transition: opacity cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
    &.watched {
      opacity: 0.3;
    }
    &:hover {
      opacity: 1;
    }
    .info,
    .background {
      background-position: center center;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .background {
      background-size: cover;
      opacity: 0.8;
    }
    .info {
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: end;

      .title {
        font-weight: 600;
        text-shadow: 0 0 20px #000;
        font-size: 18px;
        margin: 0;
        text-align: left;
        white-space: normal;
        height: auto;
        overflow: visible;
        padding: 0.5rem;
        overflow: hidden;
      }
    }
  }
`;
const StyledDescription = styled.div`
  opacity: 0;
  position: fixed;
  bottom: 0;
  z-index: -1;
  left: 0;
  min-height: 250px;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 1rem;
  font-weight: 400;
  padding: 1rem;
  box-shadow: 0px 0px 20px 15px rgba(0, 0, 0, 0.5);
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
  &.active {
    opacity: 1;
    z-index: 300;
  }
`;

type Props = {
  item: MediaModel;
  className?: string;
  onClick?: () => void;
};
const MediaItem: FC<Props> = ({ item, className, onClick }) => {
  const [active, setActive] = useState(false);
  if (!item?.id || !item?.tmdb)
    return <div className={className}>Loading...</div>;

  const title = item.tmdb.title ?? item.id ?? item.fileInfo?.fileName;

  return (
    <>
      <StyledMedia
        className={className}
        // onMouseEnter={() => setActive(true)}
        // onMouseLeave={() => setActive(false)}
        onClick={onClick}
      >
        <div className={cn('content', { watched: item.user?.watched })}>
          <div
            className="background"
            style={{ backgroundImage: `url(${item.tmdb.backdrop_path})` }}
          />
          <div className="info">
            <div className="title">{title}</div>
            <MediaItemFooter item={item} watched={!!item.user?.watched} />
          </div>
        </div>
      </StyledMedia>
      <StyledDescription className={classNames({ active })}>
        <h2>{item.fileInfo?.fileName}</h2>
        {item.tmdb.overview}
      </StyledDescription>
    </>
  );
};

export default MediaItem;
