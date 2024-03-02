import { TraktWatched } from '../handlers/traktHandler';
import db from '../services/db';

export type TraktAuthorization = {
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
};

export type TraktAuthorizationResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
};

export interface TraktConfig {
  username?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
}

class Trakt {
  appsUrl = 'https://trakt.tv/oauth/applications';
  baseUrl = 'https://api.trakt.tv';
  username?: string; // Replace with your Trakt.tv username
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  polling = false;

  constructor() {
    try {
      db.get('config').then((config) => {
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
        this.refreshToken = config.trakt.refreshToken;
      });
    } catch (e) {
      console.warn('Remember to configure Trakt from UI to use it');
    }

    //TODO: add refresh token case this.refreshAuthToken()
  }

  async configure(config: TraktConfig) {
    const savedConfig = await db.get('config');
    const newConfig = {
      ...savedConfig?.trakt,
      ...config,
    };

    return db.update('config', 'trakt', newConfig);
  }

  private post = async (
    endpoint: string,
    body: any,
    sendAuthHeaders: boolean = true,
  ) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (sendAuthHeaders) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
      headers['trakt-api-key'] = `${this.clientId}`;
      headers['trakt-api-version'] = '2';
    }

    return await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
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

  private async refreshAuthToken() {
    if (!this.refreshToken) return;

    const tokenUrl = `${this.baseUrl}/oauth/token`;
    const body = {
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'refresh_token',
    };

    const response = await this.post(tokenUrl, body, false);

    if (response?.status === 200) {
      const data = await response.json();
      await this.configure({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
    }
  }

  async authorize() {
    const codeUrl = `${this.baseUrl}/oauth/device/code`;
    const response = await this.post(
      codeUrl,
      {
        client_id: this.clientId,
      },
      false,
    );

    const data = await response?.json();

    this.pollAuth(data.device_code, data.interval * 1000);

    return data;
  }

  private async pollAuth(code: string, interval: number) {
    if (!this.polling) {
      this.polling = true;
      setTimeout(async () => {
        const response = await this.fetchAuth(code);
        if (response?.access_token) {
          await this.configure({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
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

      const response = await this.post(tokenUrl, body, false);

      return response.status === 200 ? await response.json() : undefined;
    } catch (error) {
      console.error('Error getting authorization token:', error);
      throw error;
    }
  }
}

const trakt = new Trakt();

export default trakt;
