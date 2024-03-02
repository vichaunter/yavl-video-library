import {
  FavoriteList,
  getFavoritesHandler,
  toggleFavoriteHandler,
} from '../handlers/favoriteHandlers';
import {
  Config,
  getConfigHandler,
  setConfigHandler,
} from '../handlers/getConfigHandler';
import { getMediaInfoHandlerV2 } from '../handlers/getMediaInfoHandler';
import listFilesHandler, { File } from '../handlers/listFilesHandler';
import openDirectoryHandler from '../handlers/openDirectoryHandler';
import openExternalLinkHandler from '../handlers/openExternalLinkHandler';
import openFileHandler from '../handlers/openFileHandler';
import {
  TMDBId,
  TraktWatched,
  getTraktWatchedHandler,
  toggleTraktWatchedHandler,
} from '../handlers/traktHandler';
import {
  WatchedList,
  getWatchedHandler,
  toggleWatchedHandler,
} from '../handlers/watchedHandlers';
import MediaModel from '../models/MovieModel';
import trakt, { TraktAuthorization } from './trakt';

export type ApiResponse<T> = {
  status: number;
  data: T;
  error?: string;
};

export type ApiHandler<T, K> = (
  args: T,
  event?: Electron.IpcMainInvokeEvent,
) => Promise<ApiResponse<K>>;

const send = <T>(data: any) =>
  JSON.stringify({ status: 200, data }) as unknown as ApiResponse<T>;
const sendError = (error: string) => JSON.stringify({ status: 400, error });

export class Api {
  getMediaInfo: ApiHandler<string, MediaModel> = async (fullPath) => {
    const result = await getMediaInfoHandlerV2(fullPath);
    return send(result);
  };

  openDirectory: ApiHandler<void, string> = async () => {
    const result = await openDirectoryHandler();

    return send(result);
  };

  listFiles: ApiHandler<string, File[]> = async (folder) => {
    if (!folder) sendError('missing folder argument');

    const result = await listFilesHandler(folder);

    return send(result);
  };
  getConfig: ApiHandler<void, Config> = async () => {
    const result = await getConfigHandler();

    return send(result);
  };
  setConfig: ApiHandler<Config, Config> = async (config) => {
    const result = await setConfigHandler(config);

    return send(result);
  };
  getWatched: ApiHandler<void, WatchedList> = async () => {
    const result = await getWatchedHandler();

    return send(result);
  };
  toggleWatched: ApiHandler<string | number, WatchedList> = async (id) => {
    const result = await toggleWatchedHandler(id);

    return send(result);
  };
  getTraktWatched: ApiHandler<void, TraktWatched> = async () => {
    const result = await getTraktWatchedHandler();

    return send(result);
  };
  toggleTraktWatched: ApiHandler<TMDBId, TraktWatched> = async (id) => {
    const result = await toggleTraktWatchedHandler(id);

    return send(result);
  };
  getFavorites: ApiHandler<void, FavoriteList> = async () => {
    const result = await getFavoritesHandler();

    return send(result);
  };
  toggleFavorite: ApiHandler<string, FavoriteList> = async (id) => {
    const result = await toggleFavoriteHandler(id);

    return send(result);
  };
  openFile: ApiHandler<string, File> = async (fullPath) => {
    const result = await openFileHandler(fullPath);

    return send(result);
  };
  openExternalLink: ApiHandler<string, string> = async (url) => {
    openExternalLinkHandler(url);

    return send(url);
  };

  authorizeTrakt: ApiHandler<void, TraktAuthorization> = async () => {
    const result = await trakt.authorize();

    return send(result);
  };
}

const api = new Api();

export default api;
