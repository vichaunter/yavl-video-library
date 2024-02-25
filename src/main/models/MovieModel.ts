import path from 'path';
import fs from 'fs';
import search, { TMDBQueue } from '../api/tmdb';
import { getCleanName } from '../helpers';
import db from '../services/db';
import { ffmpegSync } from '../tools/ffprobe';

interface TMDB {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MediaUser {
  favorite: boolean;
  watched: boolean;
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
  tmdb?: TMDB;
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
      if (!this.tmdb?.title) {
        const res = await TMDBQueue.run(async () => this.fetchTMDBInfo());
      }
    } catch (e) {}

    return this;
  }

  private async loadDbInfo() {
    let dbInfo;
    try {
      dbInfo = (await db.get(this.id)) as any;
    } catch (e) {
      await db.del(this.id);
    }

    this.tmdb = dbInfo?.tmdb ?? {};
    this.user = dbInfo?.user ?? {};
    this.fileInfo = dbInfo?.fileInfo ?? {};

    return this;
  }

  private async fetchTMDBInfo() {
    const result = await search(this.id);

    if (result) {
      this.tmdb = result;
      await this.persist();
    }
  }

  async forceRefetch() {
    await this.fetchTMDBInfo();

    return this;
  }

  async persist() {
    await db.put(this.id, {
      tmdb: this.tmdb,
      user: this.user,
      fileInfo: this.fileInfo,
    } as any);

    return this;
  }
}

export default MediaModel;
