import { FavoritesResponse } from '../../../main/handlers/favoriteHandlers';
import { ListFilesResponse } from '../../../main/handlers/listFilesHandler';
import { WatchedResponse } from '../../../main/handlers/watchedHandlers';
import MediaModel from '../../../main/models/MovieModel';
import {
  Api,
  ApiConfigResponse,
  ApiListFilesArgs,
  ApiMediaInfoArgs,
} from '../../../main/types';
//@ts-ignore
const winApi = window.api as Api;

function parseJson(res: any) {
  return JSON.parse(res);
}

export type GetMediaInfoClientHandler = (
  args: ApiMediaInfoArgs,
) => Promise<MediaModel | undefined>;
export type OpenDirectoryClientHandler = () => Promise<string>;
export type ListFilesClientHandler = (
  args: ApiListFilesArgs,
) => Promise<ListFilesResponse['data']>;
export type GetConfigClientHandler = () => Promise<ApiConfigResponse['data']>;
export type GetWatchedClientHandler = () => Promise<WatchedResponse['data']>;
export type ToggleWatchedClientHandler = (
  id: string,
) => Promise<WatchedResponse['data']>;
export type GetFavoritesClientHandler = () => Promise<
  FavoritesResponse['data']
>;
export type ToggleFavoriteClientHandler = (
  id: string,
) => Promise<FavoritesResponse['data']>;
export type OpenFileClientHandler = (fullPath: string) => Promise<void>;
export interface ApiClient {
  getMediaInfo: GetMediaInfoClientHandler;
  openDirectory: OpenDirectoryClientHandler;
  listFiles: ListFilesClientHandler;
  getConfig: GetConfigClientHandler;
  getWatched: GetWatchedClientHandler;
  toggleWatched: ToggleWatchedClientHandler;
  getFavorites: GetFavoritesClientHandler;
  toggleFavorite: ToggleFavoriteClientHandler;
  openFile: OpenFileClientHandler;
}

const api: ApiClient = {
  getMediaInfo: async (args) => {
    const res = await winApi.getMediaInfo(args).then(parseJson);

    return res?.data;
  },

  openDirectory: async () => {
    const res = await winApi.openDirectory().then(parseJson);

    return res.data ?? '';
  },
  listFiles: async (args) => {
    const res = await winApi.listFiles(args).then(parseJson);

    return res.data ?? [];
  },
  getConfig: async () => {
    const res = await winApi.getConfig().then(parseJson);

    return res.data ?? {};
  },
  getWatched: async () => {
    const res = await winApi.getWatched().then(parseJson);

    return res.data ?? {};
  },
  toggleWatched: async (id) => {
    const res = await winApi.toggleWatched({ id }).then(parseJson);

    return res.data ?? {};
  },
  getFavorites: async () => {
    const res = await winApi.getFavorites().then(parseJson);

    return res.data ?? {};
  },
  toggleFavorite: async (id) => {
    const res = await winApi.toggleFavorite({ id }).then(parseJson);

    return res.data ?? {};
  },
  openFile: async (fullPath) => {
    return await winApi.openFile({ fullPath });
  },
};

export default api;
