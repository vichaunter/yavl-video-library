import { app } from 'electron';
import { Level } from 'level';
import path from 'path';

const folder = app.getPath('userData');
console.log('dbFolder', folder);
const db = new Level(path.join(folder, 'db'), { valueEncoding: 'json' });

export const DB_TABLES = {
  favorites: 'favorites',
};

export default db;
