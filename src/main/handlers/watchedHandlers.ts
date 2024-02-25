import { HandlerRequest, HandlerResponse, send } from '.';
import db from '../services/db';

export type WatchedList = {
  [key: string]: boolean;
};
export type WatchedResponse = HandlerResponse<WatchedList>;

const getWatched = async (): Promise<WatchedList> => {
  let watched: Record<string, boolean> = {};

  try {
    watched = (await db.get('watched')) as any;
  } catch (e) {
    await db.put('watched', {} as any);
  }

  return watched;
};

export const getWatchedHandler = async () => send(await getWatched());

export type ToggleWatchedArgs = {
  id: string;
};

export type ToggleWatchedHandler = (
  request: HandlerRequest<ToggleWatchedArgs>,
) => Promise<string>;

export const toggleWatchedHandler: ToggleWatchedHandler = async (request) => {
  const { id } = request.args;

  const watched = await getWatched();
  watched[id] = !watched[id];

  await db.put('watched', watched as any);

  return send(watched);
};
