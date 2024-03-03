import https from 'https';
import { omitBy, isNil } from 'lodash';
import RequestQueue from '../services/queue';

const API_KEY = 'f090bb54758cabf231fb605d3e3e0468'; // kodi public key, add your one

type RequestParams = Record<string, string | number | undefined>;
export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}
export interface TMDBVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}
export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}
export interface TMDBGenre {
  id: number;
  name: string;
}
export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: TMDBGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  logo_path: string | undefined;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  videos: { results: TMDBVideo[] };
  vote_average: number;
  vote_count: number;
}
export interface TMDBSearchResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }[];
}

interface TMDBConfig {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

class TMDB {
  language = 'es';
  baseUrl = `https://api.themoviedb.org/3`;
  tmdbIimageConfig!: TMDBConfig;
  queue;

  constructor() {
    this.loadConfig();
    this.queue = new RequestQueue();
  }

  loadConfig = async () => {
    this.tmdbIimageConfig = await this.request(`/configuration`);
  };

  buildUrl = (endpoint: string, params?: RequestParams) => {
    const suffix = Object.entries(omitBy(params, isNil))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return `${this.baseUrl}${endpoint}?api_key=${API_KEY}&language=${this.language}${suffix ? `&${suffix}` : ''}`;
  };

  buildImageFullPath = (path: string, sizes: any) => {
    if (path && this.tmdbIimageConfig) {
      return `${this.tmdbIimageConfig.images.base_url}${
        sizes[sizes.length - 2]
      }${path}`;
    }
    return path;
  };

  request = <T>(endpoint: string, params?: RequestParams): Promise<T> => {
    const url = this.buildUrl(endpoint, params);

    return new Promise((resolve, reject) => {
      https
        .get(url, (resp) => {
          let data = '';

          resp.on('data', (chunk) => {
            data += chunk;
          });

          resp.on('end', () => {
            resolve(JSON.parse(data));
          });
        })
        .on('error', reject);
    });
  };

  parseMediaPaths(result: TMDBMovie) {
    if (result.backdrop_path) {
      result.backdrop_path = this.buildImageFullPath(
        result.backdrop_path,
        this.tmdbIimageConfig.images.backdrop_sizes,
      );
    }
    if (result.logo_path) {
      result.logo_path = this.buildImageFullPath(
        result.logo_path,
        this.tmdbIimageConfig.images.logo_sizes,
      );
    }

    if (result.poster_path) {
      result.poster_path = this.buildImageFullPath(
        result.poster_path,
        this.tmdbIimageConfig.images.poster_sizes,
      );
    }

    return result;
  }

  async getFullMovieInfo(tmdbId: number) {
    let result = await this.request<TMDBMovie>(`/movie/${tmdbId}`, {
      append_to_response:
        'videos,images,similar,external_ids,credits,recommendations',
    });

    if (result) {
      result = this.parseMediaPaths(result);
    }

    return result;
  }

  async searchMovie(name: string, year?: number) {
    const result = await this.request<TMDBSearchResult>('/search/movie', {
      query: encodeURIComponent(name),
      year,
    });

    if (!result || !result.results[0]?.id) return;

    return result.results[0];
  }
}

const tmdb = new TMDB();
export default tmdb;
