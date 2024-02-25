import { FC, useEffect, useState } from 'react';
import api from '../api/apiMedia';
import styled from 'styled-components';
import MediaItemFooter from './MediaItem/MediaItemFooter';
import useWatchedStore from '../store/useWatchedStore';
import cn from 'classnames';
import MediaModel from '../../../main/models/MovieModel';

const StyledMedia = styled.div`
  width: 100%;
  height: 100%;
  &:hover {
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
    z-index: 100;
    box-shadow: #777;
    transform: translateZ(10px);
    box-shadow: 0px 0px 20px 5px rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
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

type Props = {
  fullPath: string;
  className: string;
  fileName: string;
};
const MediaItem: FC<Props> = ({ fullPath, fileName, className }) => {
  const [item, setItem] = useState<MediaModel>();
  const [isWatched] = useWatchedStore((state) => [state.isWatched]);

  useEffect(() => {
    fetchInfo();
  }, [fullPath]);

  const fetchInfo = async () => {
    const media = await api.getMediaInfo({ fullPath });
    media && setItem(media);
  };

  if (!item?.id || !item?.tmdb)
    return <div className={className}>Loading...</div>;

  const watched = isWatched(item.id);
  return (
    <StyledMedia className={className}>
      <div className={cn('content', { watched })}>
        <div
          className="background"
          style={{ backgroundImage: `url(${item.tmdb.backdrop_path})` }}
        />
        <div className="info">
          <div className="title">{fileName}</div>
          <MediaItemFooter item={item} watched={watched} />
        </div>
      </div>
    </StyledMedia>
  );
};

export default MediaItem;
