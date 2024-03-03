import fs from 'fs';
import path from 'path';
import tmdb, { TMDBMovie } from '../api/tmdb';
import { TraktWatched } from '../handlers/traktHandler';
import { getCleanName } from '../helpers';
import db from '../services/db';
import { ffmpegSync } from '../tools/ffprobe';

interface MediaUser {
  favorite: boolean;
  watched?: TraktWatched;
}

interface AudioInfo {
  codecName: string;
  codecLongName: string;
  channelLayout: string;
  language: string;
}

interface SubtitleInfo {
  language: string;
  title: string;
}

interface FileInfoData {
  fullpath: string;
  filename: string;
  title: string;
  year: string; // Update type if it's supposed to be a number
  width: number;
  height: number;
  size: number;
  duration: number;
  quality: string;
  codecName: string;
  codecLongName: string;
  formatName: string;
  formatLongName: string;
  audio: AudioInfo[];
  subtitle: SubtitleInfo[];
}

interface FileInfo {
  data?: FileInfoData;
  file?: fs.Stats;
  fileName?: string;
  fileExt?: string;
}

class MediaModel {
  id!: string;
  tmdb?: TMDBMovie;
  user?: MediaUser;
  fileInfo?: FileInfo;

  async load({ id, fullPath }: { id?: string; fullPath?: string }) {
    if (!id && !fullPath)
      throw Error('ID or fullPath is required for creating the model');

    let newId = id;
    const fileInfo: FileInfo = {};
    if (fullPath) {
      fileInfo.data = await ffmpegSync(fullPath);
      fileInfo.file = fs.statSync(fullPath);
      fileInfo.fileName = path.basename(fullPath);
      fileInfo.fileExt = path.extname(fullPath);
      newId = getCleanName(fileInfo.fileName);
    }

    if (newId) {
      this.id = newId;
    } else {
      throw Error('Impossible to determine ID, check your MovieModel call');
    }

    await this.loadDbInfo();
    this.fileInfo = fileInfo;

    try {
      if (!this.tmdb?.imdb_id) {
        await tmdb.queue.run(async () => this.fetchTMDBInfo());
      }
    } catch (e) {}

    return this;
  }

  private async loadDbInfo() {
    let dbInfo;
    try {
      dbInfo = (await db.get('media'))?.[this.id];
    } catch (e) {
      await db.del('media');
    }

    this.tmdb = dbInfo?.tmdb;
    this.user = dbInfo?.user;
    this.fileInfo = dbInfo?.fileInfo;

    return this;
  }

  private async fetchTMDBInfo() {
    const result = await tmdb.searchMovie(this.id);

    if (!result) return console.error('No movie found for', this.id);

    const fullInfo = await tmdb.getFullMovieInfo(result.id);
    this.tmdb = fullInfo;

    await this.persist();
  }

  async forceRefetch() {
    await this.fetchTMDBInfo();

    return this;
  }

  async persist() {
    await db.update('media', this.id, this);

    return this;
  }
}

export default MediaModel;
