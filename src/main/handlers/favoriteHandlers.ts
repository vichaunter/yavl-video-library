import db from '../services/db';

export type FavoriteList = {
  [key: string]: boolean;
};

const getFavorites = async (): Promise<FavoriteList> => {
  let favorites: Record<string, boolean> = {};

  try {
    favorites = (await db.get('favorites')) as any;
  } catch (e) {
    await db.put('favorites', {} as any);
  }

  return favorites;
};

export const getFavoritesHandler = async () => await getFavorites();

export const toggleFavoriteHandler = async (id: string) => {
  const favorites = await getFavorites();
  favorites[id] = !favorites[id];

  await db.put('favorites', favorites as any);

  return favorites;
};
