import { HandlersMap } from '../types';

import getMediaInfo from './getMediaInfoHandler';
import listFiles from './listFilesHandler';
import openDirectory from './openDirectoryHandler';
import getConfig from './getConfigHandler';
import {
  getWatchedHandler as getWatched,
  toggleWatchedHandler as toggleWatched,
} from './watchedHandlers';
import { BrowserWindow, Event } from 'electron';
import {
  getFavoritesHandler as getFavorites,
  toggleFavoriteHandler as toggleFavorite,
} from './favoriteHandlers';
import openFile from './openFileHandler';

export const send = (data: any) => JSON.stringify({ status: 200, data });

export type HandlerRequest<T> = {
  event: Event;
  args: T;
  window: BrowserWindow;
};

export type HandlerResponse<T> = {
  status: number;
  data: T;
  error?: string;
};

const handlers: HandlersMap = {
  getMediaInfo,
  listFiles,
  openDirectory,
  getConfig,
  toggleWatched,
  getWatched,
  getFavorites,
  toggleFavorite,
  openFile,
};

export default handlers;
