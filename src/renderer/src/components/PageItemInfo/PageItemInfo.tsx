import classNames from 'classnames';
import { FaPlay } from 'react-icons/fa6';
import styled from 'styled-components';
import { TMDBId } from '../../../../main/handlers/traktHandler';
import { api } from '../../api/apiMedia';
import useFilesStore from '../../store/useFileStore';
import TrailerPlayer from '../TrailerPlayer';

const Styled = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 1rem;

  .backdrop {
    width: 60%;
    height: 130%;
    background-size: cover;
    background-position: center;
    right: 0;
    top: 0;
    position: absolute;
    -webkit-mask-image: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    mask-image: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 80%
    );
  }

  .info {
    width: 50%;
    .overview {
      margin-top: 1rem;
    }
    .row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
      .rating-stars {
        position: relative;
        width: 145px;
        height: 32px;
        .empty {
          position: absolute;
          top: 0;
          filter: grayscale();
          opacity: 0.5;
        }
        .filled {
          display: flex;
          overflow: hidden;
          top: 0;
          position: absolute;
        }
      }
    }
    .footer {
      position: absolute;
      right: 1rem;
      bottom: 4rem;
      font-size: 2rem;
      display: flex;
      gap: 1rem;
      .item {
        :hover {
          color: white;
        }
        cursor: pointer;
      }
    }
  }
`;

type Props = {
  selectedId: TMDBId;
};
const PageItemInfo = ({ selectedId }: Props) => {
  const [getFile] = useFilesStore((state) => [state.getFile]);
  const item = getFile(selectedId);

  if (!item) return null;

  const title = item.tmdb?.title ?? item.id ?? item.fileInfo?.fileName;
  return (
    <Styled>
      <div
        className="backdrop"
        style={{
          backgroundImage: `url(${item.tmdb?.backdrop_path})`,
        }}
      />
      <h1>
        {title} {item.fileInfo?.fileName && <h6>{item.fileInfo?.fileName}</h6>}
      </h1>

      <div className="info">
        <div className="row">
          <div className="rating-stars">
            <div className="empty">⭐⭐⭐⭐⭐</div>
            <div
              className="filled"
              style={{
                width: `${(item.tmdb?.vote_average ?? 0) * 10}%`,
              }}
            >
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="rating">{item.tmdb?.vote_average}</div>
          <div className="genres">
            {item.tmdb?.genres.map((g) => g.name).join(', ')}
          </div>
          <div className="year">{item.tmdb?.release_date}</div>
        </div>
        <div className="overview">{item.tmdb?.overview}</div>
        <div className="footer">
          <TrailerPlayer className="item" item={item} />
          <div
            className={classNames('item', 'play')}
            onClick={() => {
              item.fileInfo?.data?.fullpath &&
                api.openFile(item.fileInfo?.data?.fullpath);
            }}
          >
            <FaPlay />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default PageItemInfo;
