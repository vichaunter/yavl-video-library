import { app } from 'electron';
import { Level } from 'level';
import path from 'path';
import { FavoriteList } from '../handlers/favoriteHandlers';
import { Config } from '../handlers/getConfigHandler';
import MediaModel from '../models/MovieModel';
import { WatchedList } from '../handlers/watchedHandlers';

type DbTables = {
  config: Config;
  favorites: FavoriteList;
  media: {
    [key: string]: MediaModel;
  };
  watched: WatchedList;
};

class Db {
  instance;

  constructor() {
    const folder = app.getPath('userData');
    this.instance = new Level(path.join(folder, 'db'), {
      valueEncoding: 'json',
    });
  }

  get = async <K extends keyof DbTables>(
    table: K,
  ): Promise<DbTables[K] | void> => {
    try {
      return (await this.instance.get(table)) as unknown as DbTables[K];
    } catch (err) {
      console.log(err);
    }
    return;
  };

  del = async <K extends keyof DbTables>(table: K): Promise<void> => {
    try {
      return await this.instance.del(table);
    } catch (err) {
      console.log('db.del error:', err);
    }
  };

  put = async <K extends keyof DbTables>(
    table: K,
    data: DbTables[K],
  ): Promise<DbTables[K] | void> => {
    try {
      await this.instance.put(table, data as string);
      return data;
    } catch (err) {
      console.log('db.put error:', err);
    }
    return;
  };

  update = async <K extends keyof DbTables>(
    table: K,
    key: string,
    data: DbTables[K][keyof DbTables[K]],
  ): Promise<DbTables[K] | void> => {
    const previous = (await this.get(table)) ?? {};
    const newObj = {
      ...previous,
      [key]: data,
    };

    return await this.put(table, newObj);
  };
}

const db = new Db();

export default db;
