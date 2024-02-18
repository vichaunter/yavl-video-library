import { fetchMovieData } from "./api";
import db from "./db";

export type MovieAudio = {
  codecLongName: string;
  channelLayout: string;
  codecName: string;
  language: string;
};
export type MovieSubtitle = {
  language: string;
  title: string;
};
export type MovieInfo = {
  audio: MovieAudio[];
  codecLongName: string;
  codecName: string;
  duration: number;
  filename: string;
  formatLongName: string;
  formatName: string;
  fullpath: string;
  height: number;
  quality: string;
  size: number;
  subtitle: MovieSubtitle[];
  title: string;
  tmdb: {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  };
  width: number;
  year: string;
};

class Store {
  getMovieInfo = async (filePath: string, altTitle: string) => {
    let info: MovieInfo | undefined = undefined;
    try {
      //@ts-ignore
      info = await db.get(altTitle);
    } catch (e) {}

    if (!info) {
      //@ts-ignore
      info = await fetchMovieData(filePath, altTitle);
      //@ts-ignore
      db.put(altTitle, info);
    }

    return info;
  };

  getLastFolder = async () => await db.get("lastFolder");

  saveLastFolder = (path: string) => db.put("lastFolder", path);
}

const store = new Store();

export default store;
