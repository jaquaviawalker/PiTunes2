import { SpotifyDevice, SpotifyAlbum } from '../interfaces/SpotifyClient';
import logger from '../utils/logger';
import { UserAuth } from './UserAuth';
import SpotifyWebApi from 'spotify-web-api-node';

export type AlbumId = string;
export type DeviceId = string;

export class SpotifyClient {
  private albumId: AlbumId;
  private deviceId: DeviceId;
  private auth: UserAuth;
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.deviceId = '';
    this.albumId = '';
    this.auth = new UserAuth();
    this.spotifyApi = new SpotifyWebApi();
  }

  /**
   * Searches for albums on Spotify based on a query string.
   *
   * @param {string} query - The search query (album name, artist, etc.)
   * @param {Object} [options] - Optional search parameters
   * @param {number} [options.limit=5] - Maximum number of results to return
   * @returns {Promise<SpotifyAlbum[]>} Array of album objects with simplified properties
   * @throws {Error} If the search fails or authentication fails
   */
  public async searchAlbum(
    query: string,
    options?: { limit?: number }
  ): Promise<SpotifyAlbum[]> {
    const searchOptions = {
      limit: options?.limit || 5,
    };
    try {
      await this.auth.initializeSpotifyAPI(this.spotifyApi);
      const response = await this.spotifyApi.searchAlbums(query, searchOptions);
      const albums = response.body.albums?.items || [];
      if (albums.length === 0) {
        console.log(`No albums found matching: ${query}`);
      }
      return albums.map((album) => ({
        id: album.id,
        name: album.name,
        artists: album.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        images: album.images.map((image) => ({
          url: image.url,
          height: image.height || 0,
          width: image.width || 0,
        })),
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        uri: album.uri,
      }));
    } catch (error) {
      console.error('Error searching for albums:', error);
      throw error;
    }
  }

  /**
   * Gets available Spotify playback devices, returns the first device or null if none found
   *
   * @returns First available device or null if no devices found
   */
  public async getAvailableDevices(): Promise<SpotifyDevice | null> {
    try {
      await this.auth.initializeSpotifyAPI(this.spotifyApi);
      const response = await this.spotifyApi.getMyDevices();
      const devices = response.body.devices || [];
      if (devices.length === 0) {
        console.log('No devices found');
        return null;
      }
      const firstDevice = devices[0];

      const spotifyDevice: SpotifyDevice = {
        id: firstDevice.id || '',
        is_active: Boolean(firstDevice.is_active),
        is_private_session: Boolean(firstDevice.is_private_session),
        is_restricted: Boolean(firstDevice.is_restricted),
        name: firstDevice.name || '',
        type: firstDevice.type || '',
        volume_percent:
          firstDevice.volume_percent === null
            ? undefined
            : firstDevice.volume_percent,
      };

      return spotifyDevice;
    } catch (error) {
      console.error('Error getting devices', error);
      throw error;
    }
  }

  /**
   * Plays the currently set album on the currently set device
   *
   * @returns Promise that resolves when the album starts playing
   * @throws Error if playing fails or authentication fails
   */
  public async playAlbum(): Promise<void> {
    try {
      await this.auth.initializeSpotifyAPI(this.spotifyApi);
      await this.spotifyApi.play({
        device_id: this.deviceId,
        context_uri: `spotify:album:${this.albumId}`,
      });
    } catch (error) {
      console.error('Error playing album', error);
      throw error;
    }
  }

  public async getPlaybackState() {
    try {
      await this.auth.initializeSpotifyAPI(this.spotifyApi);
      const data = await this.spotifyApi.getMyCurrentPlaybackState();
      if (data == null) {
        return null;
      }
      return {
        is_playing: data.body.is_playing ?? false,
        progress_ms: data.body.progress_ms ?? 0,
        device: {
          id: data.body.device?.id || '',
          name: data.body.device?.name || '',
          type: data.body.device?.type || '',
          volume_percent: data.body.device?.volume_percent ?? 0,
        },
        shuffle_state: data.body.shuffle_state,
        repeat_state: data.body.repeat_state,
        timestamp: data.body.timestamp,
      };
    } catch (error) {
      console.error('Error getting playback state', error);
      throw error;
    }
  }

  public async playbackControl(action: string) {
    try {
      await this.auth.initializeSpotifyAPI(this.spotifyApi);
      switch (action) {
        case 'play':
          await this.spotifyApi.play();
          break;
        case 'pause':
          await this.spotifyApi.pause();
          break;
        case 'next':
          await this.spotifyApi.skipToNext();
          break;
        case 'previous':
          await this.spotifyApi.skipToPrevious();
          break;
        default:
          throw new Error(`Unknown playback action: ${action}`);
      }
    } catch (error) {
      console.error('Error controlling playback', error);
      throw error;
    }
  }
  /**
   * Sets the Spotify album ID to be used for playback
   *
   * @param albumId - Spotify album ID
   */
  public setAlbumId(albumId: string): void {
    this.albumId = albumId;
  }
  /**
   * Sets the Spotify device ID to use for playback
   *
   * @param deviceId - Spotify device ID
   */
  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }
}

// // Play album on Spotify
// async function playAlbum(albumUri);

// // Get available devices
// async function getDevices();

// // Set active device
// async function setDevice(deviceId);

// // Pause playback
// async function pausePlayback();

// // Resume playback
// async function resumePlayback();

// // Get current playback state
// async function getPlaybackState();

// // Skip to next track
// async function skipToNext();

// // Skip to previous track
// async function skipToPrevious();
