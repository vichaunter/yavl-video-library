import { TraktWatched } from '../handlers/traktHandler';
import db from '../services/db';
export interface TraktConfig {
  username?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

class Trakt {
  baseUrl = 'https://api.trakt.tv';
  username?: string; // Replace with your Trakt.tv username
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  polling = false;

  constructor() {
    try {
      db.get('config').then((config) => {
        console.log(config);
        if (
          !config ||
          !config.trakt ||
          !config.trakt.username ||
          !config.trakt.clientId
        )
          throw Error('missing db config');

        this.username = config.trakt.username;
        this.clientId = config.trakt.clientId;
        this.clientSecret = config.trakt.clientSecret;
        this.accessToken = config.trakt.accessToken;

        this.authorize();
      });
    } catch (e) {
      console.warn('Remember to configure Trakt from UI to use it');
    }
  }

  async configure(config: TraktConfig) {
    return db.update('config', 'trakt', config);
  }

  private post = async (endpoint: string, body: any) => {
    return await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'trakt-api-key': `${this.clientId}`,
        'trakt-api-version': '2',
      },
      body: JSON.stringify(body),
    });
  };
  private fetch = async (endpoint: string) =>
    await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-key': `${this.clientId}`,
        'trakt-api-version': '2',
      },
    });

  async addToHistory(tmdbId: number) {
    //TODO: add any kind of item (movies, shows, seasons, episodes https://trakt.docs.apiary.io/#reference/sync/add-to-history/add-items-to-watched-history?console=1)
    const body = {
      movies: [
        {
          ids: {
            tmdb: tmdbId,
          },
        },
      ],
    };

    return this.post('/sync/history', body);
  }

  async removeFromHistory(tmdbId: number) {
    const body = {
      movies: [
        {
          ids: {
            tmdb: tmdbId,
          },
        },
      ],
    };
    return this.post('/sync/history/remove', body);
  }

  getPopularMovies = async () => {
    try {
      const response = await this.fetch(`/movies/popular`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  };

  getWatchedMovies = async (): Promise<TraktWatched[]> => {
    try {
      const response = await this.fetch(
        `/users/${this.username}/history/movies?limit=10000`,
      );

      if (response.status === 200) return await response.json();

      return [];
    } catch (error) {
      console.error('Error fetching watched movies:', error);
      throw error;
    }
  };

  searchMovieByTMDBId = async (tmdbId: string) => {
    try {
      const response = await this.fetch(`/search/tmdb/${tmdbId}`);

      return response;
    } catch (error) {
      console.error('Error searching for movie by TMDB ID:', error);
      throw error;
    }
  };

  async authorize() {
    const codeUrl = `${this.baseUrl}/oauth/device/code`;
    const response = await fetch(codeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
      }),
    });

    const data = await response?.json();

    this.pollAuth(data.device_code, data.interval * 1000);
  }

  private async pollAuth(code: string, interval: number) {
    if (!this.polling) {
      this.polling = true;
      setTimeout(async () => {
        const response = await this.fetchAuth(code);
        if (response) {
          const config = await db.get('config');

          await this.configure({
            ...config?.trakt,
            accessToken: response.access_token,
          });

          this.accessToken = response.access_token;
          return response.access_token;
        } else {
          this.polling = false;
          this.pollAuth(code, interval);
        }
      }, interval);
    }
  }

  private async fetchAuth(code: string) {
    try {
      const tokenUrl = `${this.baseUrl}/oauth/device/token`;

      const body = {
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      return response.status === 200 ? await response.json() : undefined;
    } catch (error) {
      console.error('Error getting authorization token:', error);
      throw error;
    }
  }
}

const trakt = new Trakt();

export default trakt;
