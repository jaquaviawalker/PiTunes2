import SpotifyWebApi from 'spotify-web-api-node';
import logger from '../utils/logger';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export class UserAuth {
  private spotifyApi: SpotifyWebApi;
  private code: string;
  private filePath: string;
  private authenticationStatus: boolean;
  private tokenExpirationTime: number;
  private tokenExpirationThreshold: number;

  constructor() {
    this.code = '';
    this.filePath = 'data/spotify_token.json';
    this.authenticationStatus = false;
    this.tokenExpirationTime = 0;
    this.tokenExpirationThreshold = 60000;
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }

  public startAuthFlow() {
    //  Generate a random state string for security
    let state = this.generateRandomString(16);
    // Construct the Spotify authorization URL with client ID, redirect URI, scopes, and state
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'streaming',
    ];
    return this.spotifyApi.createAuthorizeURL(scopes, state);
  }

  /**
   * Authenticates with Spotify using authorization code.
   * @private
   */
  public async authenticateWithAuthCode(): Promise<void> {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(this.code);
      this.authenticationStatus = true;
      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;

      logger.info('Auth code token received', {
        expiresIn: data.body.expires_in,
        expirationTime: new Date(this.tokenExpirationTime).toISOString(),
      });

      this.spotifyApi.setAccessToken(data.body.access_token);
      this.spotifyApi.setRefreshToken(data.body.refresh_token);
      await mkdir(path.dirname(this.filePath), { recursive: true });

      await writeFile(
        this.filePath,
        JSON.stringify(
          {
            refresh_token: data.body.refresh_token,
            access_token: data.body.access_token,
            expires_in: data.body.expires_in,
            expiration_time: new Date(this.tokenExpirationTime).toISOString(),
          },
          null,
          2
        ),
        'utf8'
      );
    } catch (err) {
      logger.error('Failed to get access token using auth code', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  //   // Handle OAuth callback
  //   public async handleAuthCallback(code: string) {}

  // Save tokens to file
  public async saveTokens(
    newAccessToken: string,
    newRefreshToken: string,
    newExpiresIn: number
  ): Promise<void> {
    try {
      this.tokenExpirationTime = Date.now() + newExpiresIn * 1000;
      await mkdir(path.dirname(this.filePath), { recursive: true });
      await writeFile(
        this.filePath,
        JSON.stringify(
          {
            refresh_token: newRefreshToken,
            access_token: newAccessToken,
            expires_in: newExpiresIn,
            expiration_time: new Date(this.tokenExpirationTime).toISOString(),
          },
          null,
          2
        ),
        'utf8'
      );
    } catch (err) {
      logger.error('Failed to save tokens to file', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  public async readTokensFromFile(): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expiration_time: string;
  }> {
    try {
      const data = await readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      logger.error('Failed to read tokens to file', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  // //   // Check if token is expired
  public async isTokenExpired(): Promise<boolean> {
    try {
      const data = await this.readTokensFromFile();
      const now = Date.now();
      const expiredTime = data.expiration_time;
      return now > Date.parse(expiredTime);
    } catch (err) {
      logger.error('Unable to read file to determine if tokens expired ', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return true;
  }

  public async restoreTokens(): Promise<
    | {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expiration_time: string;
      }
    | undefined
  > {
    try {
      const data = await this.readTokensFromFile();
      this.spotifyApi.setAccessToken(data.access_token);
      this.spotifyApi.setRefreshToken(data.refresh_token);
      return data;
    } catch (err) {
      logger.error('Unable to restore token ', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  //   // Refresh access token when expired
  public async refreshAccessToken(): Promise<string | void> {
    const isExpired = await this.isTokenExpired();

    if (!isExpired) {
      // Still need to restore tokens to ensure they're set
      await this.restoreTokens();
      return;
    }
    try {
      let result = await this.restoreTokens();
      if (!result) {
        logger.error('Could not restore tokens for refresh');
        throw new Error('Could not restore tokens for refresh');
      }
      const data = await this.spotifyApi.refreshAccessToken();
      this.spotifyApi.setAccessToken(data.body.access_token);

      await this.saveTokens(
        data.body.access_token,
        data.body.refresh_token ?? result.refresh_token,
        data.body.expires_in
      );

      return data.body.access_token;
    } catch (err) {
      logger.error('Failed to refresh access tokens', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  //   // Initialize Spotify API with saved tokens
  public async initializeSpotifyAPI(
    externalClient?: SpotifyWebApi
  ): Promise<void> {
    try {
      await this.refreshAccessToken();
      if (externalClient) {
        const accessToken = this.spotifyApi.getAccessToken();
        const refreshToken = this.spotifyApi.getRefreshToken();

        if (accessToken) {
          externalClient.setAccessToken(accessToken);
        }
        if (refreshToken) {
          externalClient.setRefreshToken(refreshToken);
        }
      }
    } catch (err) {
      logger.error('Unable to initialize', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  private generateRandomString(length: number) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public setCode(code: string) {
    this.code = code;
  }
}
