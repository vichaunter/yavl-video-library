import { FC } from 'react';
import { FaCheck, FaPlay, FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import cn from 'classnames';
import useFavoriteStore from '../../store/useFavoriteStore';
import useWatchedStore from '../../store/useWatchedStore';
import MediaModel from '../../../../main/models/MovieModel';
import api from '../../api/apiMedia';

const Styled = styled.div`
  height: 40px;
  color: #fff;
  background-color: #1d1d1d;
  overflow: hidden;
  white-space: nowrap;
  display: flex;

  .item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 40px;
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
  }

  .watch {
    color: purple;
    &.watched,
    &:hover {
      color: white;
      background-color: purple;
      &:hover {
      }
    }
  }
  .favorite {
    color: #e85d04;

    &.saved,
    &:hover {
      color: white;
      background-color: #e85d04;
    }
  }
  .play {
    color: #aaa;

    &:hover {
      color: white;
      background-color: #777;
    }
  }
`;

type Props = {
  item: MediaModel;
  watched?: boolean;
};
const MediaItemFooter: FC<Props> = ({ item, watched }) => {
  const [isFavorite, toggleFavorite] = useFavoriteStore((state) => [
    state.isFavorite,
    state.toggleFavorite,
  ]);
  const [toggleWatched] = useWatchedStore((state) => [state.toggleWatched]);

  return (
    <Styled>
      <div
        className={cn('item', 'watch', { watched })}
        onClick={() => toggleWatched(item.id)}
      >
        <FaCheck />
      </div>{' '}
      <div
        className={cn('item', 'favorite', { saved: isFavorite(item.id) })}
        onClick={() => toggleFavorite(item.id)}
      >
        <FaStar />
      </div>{' '}
      <div
        className={cn('item', 'play')}
        onClick={() => {
          item.fileInfo?.data?.fullpath &&
            api.openFile(item.fileInfo?.data?.fullpath);
        }}
      >
        <FaPlay />
      </div>
    </Styled>
  );
};

export default MediaItemFooter;
