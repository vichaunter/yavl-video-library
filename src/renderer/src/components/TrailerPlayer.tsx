import { filter } from 'lodash';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { LuClapperboard } from 'react-icons/lu';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { TMDBMovie } from '../../../main/api/tmdb';
import MediaModel from '../../../main/models/MovieModel';

const Style = styled.div`
  cursor: pointer;

  .trailer-modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.9);
    > button {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
  }
`;

const Trailer = ({
  trailer,
}: {
  trailer: TMDBMovie['videos']['results'][0];
}) => {
  const [open, setOpen] = useState(false);

  if (!open) return <LuClapperboard onClick={() => setOpen(true)} />;
  return (
    <div className="trailer-modal">
      <button onClick={() => setOpen(false)} className="link">
        <FaTimes />
      </button>
      {trailer.site === 'YouTube' && (
        <ReactPlayer url={`https://www.youtube.com/watch?v=${trailer.key}`} />
      )}
    </div>
  );
};

type Props = {
  item: MediaModel;
  className?: string;
};
const TrailerPlayer = ({ item, className }: Props) => {
  const trailers = filter(item?.tmdb?.videos?.results, { type: 'Trailer' });

  if (!trailers) return null;

  return (
    <Style className={className}>
      {trailers.map((trailer) => (
        <Trailer key={trailer.id} trailer={trailer} />
      ))}
    </Style>
  );
};

export default TrailerPlayer;
