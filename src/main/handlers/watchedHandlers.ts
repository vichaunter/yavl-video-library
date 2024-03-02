import db from '../services/db';

export type WatchedList = {
  [key: string | number]: boolean;
};

const saveWatched = async (watched: WatchedList) =>
  await db.put('watched', {} as any);

const getWatched = async (): Promise<WatchedList> => {
  let watched: Record<string, boolean> = {};

  try {
    watched = (await db.get('watched')) as any;
  } catch (e) {
    await saveWatched({});
  }

  return watched;
};

export const getWatchedHandler = async () => await getWatched();

export const toggleWatchedHandler = async (
  id: string | number,
): Promise<WatchedList> => {
  const watched = await getWatched();
  watched[id] = !watched[id];

  await saveWatched(watched);

  return watched;
};
