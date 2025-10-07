"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyClient = void 0;
const UserAuth_1 = require("./UserAuth");
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
class SpotifyClient {
    constructor() {
        this.deviceId = '';
        this.albumId = '';
        this.auth = new UserAuth_1.UserAuth();
        this.spotifyApi = new spotify_web_api_node_1.default();
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
    async searchAlbum(query, options) {
        const searchOptions = {
            limit: options?.limit || 5,
        };
        try {
            console.log('Initializing Spotify API for search...');
            await this.auth.initializeSpotifyAPI(this.spotifyApi);
            // Check if token was successfully set
            const accessToken = this.spotifyApi.getAccessToken();
            console.log('Access token after initialization:', accessToken ? 'Token present' : 'No token');
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
        }
        catch (error) {
            console.error('Error searching for albums:', error);
            throw error;
        }
    }
    /**
     * Gets available Spotify playback devices, returns the first device or null if none found
     *
     * @returns First available device or null if no devices found
     */
    async getAvailableDevices() {
        try {
            await this.auth.initializeSpotifyAPI(this.spotifyApi);
            const response = await this.spotifyApi.getMyDevices();
            const devices = response.body.devices || [];
            if (devices.length === 0) {
                console.log('No devices found');
                return null;
            }
            const firstDevice = devices[0];
            const spotifyDevice = {
                id: firstDevice.id || '',
                is_active: Boolean(firstDevice.is_active),
                is_private_session: Boolean(firstDevice.is_private_session),
                is_restricted: Boolean(firstDevice.is_restricted),
                name: firstDevice.name || '',
                type: firstDevice.type || '',
                volume_percent: firstDevice.volume_percent === null
                    ? undefined
                    : firstDevice.volume_percent,
            };
            return spotifyDevice;
        }
        catch (error) {
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
    async playAlbum() {
        try {
            await this.auth.initializeSpotifyAPI(this.spotifyApi);
            await this.spotifyApi.play({
                device_id: this.deviceId,
                context_uri: `spotify:album:${this.albumId}`,
            });
        }
        catch (error) {
            console.error('Error playing album', error);
            throw error;
        }
    }
    /**
     * Sets the Spotify album ID to be used for playback
     *
     * @param albumId - Spotify album ID
     */
    setAlbumId(albumId) {
        this.albumId = albumId;
    }
    /**
     * Sets the Spotify device ID to use for playback
     *
     * @param deviceId - Spotify device ID
     */
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
}
exports.SpotifyClient = SpotifyClient;
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
