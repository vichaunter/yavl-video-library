import { TraktConfig } from '../api/trakt';
import db from '../services/db';

export type Config = {
  trakt?: TraktConfig;
  selectedPath?: string;
};

export const getConfigHandler = async (): Promise<Config> => {
  try {
    return (await db.get('config')) as Config;
  } catch (e) {
    console.log(e);
  }

  return {};
};

export const setConfigHandler = async (config: Config): Promise<Config> => {
  let currentConfig = {};
  try {
    currentConfig = (await db.get('config')) as unknown as Config;
  } catch (err) {
    console.log(err);
  }

  const newConfig = {
    ...currentConfig,
    ...config,
  };

  await db.put('config', newConfig as any);

  return newConfig;
};
