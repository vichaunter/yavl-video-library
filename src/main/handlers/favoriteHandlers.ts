import { HandlerRequest, HandlerResponse, send } from '.';
import db, { DB_TABLES } from '../services/db';

export type FavoriteList = {
  [key: string]: boolean;
};
export type FavoritesResponse = HandlerResponse<FavoriteList>;

const getFavorites = async (): Promise<FavoriteList> => {
  let favorites: Record<string, boolean> = {};

  try {
    favorites = (await db.get(DB_TABLES.favorites)) as any;
  } catch (e) {
    await db.put(DB_TABLES.favorites, {} as any);
  }

  return favorites;
};

export const getFavoritesHandler = async () => send(await getFavorites());

export type ToggleFavoriteArgs = {
  id: string;
};

export type ToggleFavoriteHandler = (
  request: HandlerRequest<ToggleFavoriteArgs>,
) => Promise<string>;

export const toggleFavoriteHandler: ToggleFavoriteHandler = async (request) => {
  const { id } = request.args;

  const favorites = await getFavorites();
  favorites[id] = !favorites[id];

  await db.put(DB_TABLES.favorites, favorites as any);

  return send(favorites);
};
