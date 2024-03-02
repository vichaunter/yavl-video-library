import trakt from '../api/trakt';
import db from '../services/db';

export type TraktWatched = {
  id: number;
  watched_at: string;
  action: string;
  type: string;
  movie: {
    title: string;
    year: 2023;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
};
export type TMDBId = number;
export type TraktWatchedResponse = Record<TMDBId, TraktWatched>;

const getTraktWatched = async () => {
  let watched: Record<number, TraktWatched> = {};
  try {
    const res = await trakt.getWatchedMovies();
    res.forEach((item) => {
      watched[item.movie.ids.tmdb] = item;
    });
  } catch (e) {
    console.log(e);
  }

  return watched;
};

export const getTraktWatchedHandler = async () => await getTraktWatched();

export type ToggleTraktWatchedArgs = {
  id: TMDBId;
};

export const toggleTraktWatchedHandler = async (
  id: TMDBId,
): Promise<Record<number, TraktWatched>> => {
  const watched = await getTraktWatched();
  const item = watched[id];

  let response;
  try {
    if (item?.action === 'watch') {
      response = await trakt.removeFromHistory(id);
    } else {
      response = await trakt.addToHistory(id);
    }
  } catch (err) {
    console.log(err);
  }

  const newWatched = await getTraktWatched();
  await db.put('watched', newWatched as any);

  return newWatched;
};
