import { Api, ApiResponse } from '../../../main/api/api';
import { TraktAuthorization } from '../../../main/api/trakt';
import { FavoriteList } from '../../../main/handlers/favoriteHandlers';
import { Config } from '../../../main/handlers/getConfigHandler';
import { File } from '../../../main/handlers/listFilesHandler';
import { TMDBId, TraktWatched } from '../../../main/handlers/traktHandler';
import { WatchedList } from '../../../main/handlers/watchedHandlers';
import MediaModel from '../../../main/models/MovieModel';

//@ts-ignore
export const winApi = window.api as Api;

export function parseJson(res: any) {
  return JSON.parse(res);
}
async function request<T>(
  promise: Promise<ApiResponse<T>>,
): Promise<ApiResponse<T> | null> {
  try {
    return await promise.then(parseJson);
  } catch (err) {
    console.error(err);
  }

  return null;
}

class ApiV2 {
  async getMediaInfo(fullPath: string) {
    const res = await request<MediaModel>(winApi.getMediaInfo(fullPath));

    return res?.data;
  }
  async openDirectory() {
    const res = await request<string>(winApi.openDirectory());

    return res?.data;
  }
  async listFiles(folder: string) {
    const res = await request<File[]>(winApi.listFiles(folder));

    return res?.data;
  }
  async getConfig() {
    const res = await request<Config>(winApi.getConfig());

    return res?.data;
  }
  async setConfig(config: Config) {
    const res = await request<Config>(winApi.setConfig(config));

    return res?.data;
  }
  async getWatched() {
    const res = await request<WatchedList>(winApi.getWatched());

    return res?.data;
  }
  async toggleWatched(id: string | number) {
    const res = await request<WatchedList>(winApi.toggleWatched(id));

    return res?.data;
  }
  async getTraktWatched() {
    const res = await request<TraktWatched>(winApi.getTraktWatched());

    return res?.data;
  }
  async toggleTraktWatched(id: TMDBId) {
    const res = await request<TraktWatched>(winApi.toggleTraktWatched(id));

    return res?.data;
  }
  async getFavorites() {
    const res = await request<FavoriteList>(winApi.getFavorites());

    return res?.data;
  }
  async toggleFavorite(id: string) {
    const res = await request<FavoriteList>(winApi.toggleFavorite(id));

    return res?.data;
  }
  async openFile(fullPath: string) {
    const res = await request<File>(winApi.openFile(fullPath));

    return res?.data;
  }
  async openExternalLink(url: string) {
    const res = await request<string>(winApi.openExternalLink(url));

    return res?.data;
  }
  async authorizeTrakt() {
    const res = await request<TraktAuthorization>(winApi.authorizeTrakt());

    return res?.data;
  }
}

export const api = new ApiV2();
