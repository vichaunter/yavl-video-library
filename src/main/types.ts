import { BrowserWindow } from 'electron';
import { HANDLERS } from './constants';
import { ToggleWatchedArgs, WatchedResponse } from './handlers/watchedHandlers';
import { Media } from './helpers';
import {
  FavoritesResponse,
  ToggleFavoriteArgs,
} from './handlers/favoriteHandlers';
import MediaModel from './models/MovieModel';
import { OpenFileArgs } from './handlers/openFileHandler';

export type HandlersType = keyof typeof HANDLERS;
export type HandlersMap = {
  [key in HandlersType]: (options: {
    event: any;
    args: any;
    window: BrowserWindow;
  }) => Promise<any>;
};

export type ApiMediaInfoArgs = {
  fullPath: string;
};
export type ApiListFilesArgs = {
  folder: string;
};
export type ApiWatchedArgs = {
  name: string;
};
export type ApiConfigResponse = {
  status: number;
  data: {
    selectedPath: string;
  };
};

export interface Api {
  getMediaInfo: (args: ApiMediaInfoArgs) => Promise<MediaModel | undefined>;
  openDirectory: () => Promise<string>;
  listFiles: (args: ApiListFilesArgs) => Promise<Media[]>;
  getConfig: () => Promise<ApiConfigResponse>;
  getWatched: () => Promise<WatchedResponse>;
  toggleWatched: (args: ToggleWatchedArgs) => Promise<WatchedResponse>;
  getFavorites: () => Promise<FavoritesResponse>;
  toggleFavorite: (args: ToggleFavoriteArgs) => Promise<FavoritesResponse>;
  openFile: (args: OpenFileArgs) => Promise<void>;
}

export interface FFprobeOutput {
  format: {
    filename: string;
    duration: string;
    bit_rate: string;
  };
  streams: {
    codec_name: string;
    codec_type: string;
    codec_long_name: string;
    channel_layout: string;
    tags?: {
      title: string;
      language: string;
    };
  }[];
}
