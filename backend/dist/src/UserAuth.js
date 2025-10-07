"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuth = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const logger_1 = __importDefault(require("../utils/logger"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserAuth {
    constructor() {
        this.code = '';
        this.filePath = 'data/spotify_token.json';
        this.authenticationStatus = false;
        this.tokenExpirationTime = 0;
        this.tokenExpirationThreshold = 60000;
        this.spotifyApi = new spotify_web_api_node_1.default({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        });
    }
    startAuthFlow() {
        //  Generate a random state string for security
        let state = this.generateRandomString(16);
        // Construct the Spotify authorization URL with client ID, redirect URI, scopes, and state
        const scopes = [
            'user-read-private',
            'user-read-email',
            'user-read-playback-state',
        ];
        return this.spotifyApi.createAuthorizeURL(scopes, state);
    }
    /**
     * Authenticates with Spotify using authorization code.
     * @private
     */
    async authenticateWithAuthCode() {
        try {
            const data = await this.spotifyApi.authorizationCodeGrant(this.code);
            this.authenticationStatus = true;
            this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
            logger_1.default.info('Auth code token received', {
                expiresIn: data.body.expires_in,
                expirationTime: new Date(this.tokenExpirationTime).toISOString(),
            });
            this.spotifyApi.setAccessToken(data.body.access_token);
            this.spotifyApi.setRefreshToken(data.body.refresh_token);
            await (0, promises_1.mkdir)(path_1.default.dirname(this.filePath), { recursive: true });
            await (0, promises_1.writeFile)(this.filePath, JSON.stringify({
                refresh_token: data.body.refresh_token,
                access_token: data.body.access_token,
                expires_in: data.body.expires_in,
                expiration_time: new Date(this.tokenExpirationTime).toISOString(),
            }, null, 2), 'utf8');
        }
        catch (err) {
            logger_1.default.error('Failed to get access token using auth code', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    //   // Handle OAuth callback
    //   public async handleAuthCallback(code: string) {}
    // Save tokens to file
    async saveTokens(newAccessToken, newRefreshToken, newExpiresIn) {
        try {
            this.tokenExpirationTime = Date.now() + newExpiresIn * 1000;
            await (0, promises_1.mkdir)(path_1.default.dirname(this.filePath), { recursive: true });
            await (0, promises_1.writeFile)(this.filePath, JSON.stringify({
                refresh_token: newRefreshToken,
                access_token: newAccessToken,
                expires_in: newExpiresIn,
                expiration_time: new Date(this.tokenExpirationTime).toISOString(),
            }, null, 2), 'utf8');
        }
        catch (err) {
            logger_1.default.error('Failed to save tokens to file', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    async readTokensFromFile() {
        try {
            const data = await (0, promises_1.readFile)(this.filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            logger_1.default.error('Failed to read tokens to file', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    // //   // Check if token is expired
    async isTokenExpired() {
        try {
            const data = await this.readTokensFromFile();
            const now = Date.now();
            const expiredTime = data.expiration_time;
            return now > Date.parse(expiredTime);
        }
        catch (err) {
            logger_1.default.error('Unable to read file to determine if tokens expired ', {
                error: err instanceof Error ? err.message : String(err),
            });
        }
        return true;
    }
    async restoreTokens() {
        try {
            const data = await this.readTokensFromFile();
            this.spotifyApi.setAccessToken(data.access_token);
            this.spotifyApi.setRefreshToken(data.refresh_token);
            return data;
        }
        catch (err) {
            logger_1.default.error('Unable to restore token ', {
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
    //   // Refresh access token when expired
    async refreshAccessToken() {
        if (!(await this.isTokenExpired())) {
            return;
        }
        try {
            let result = await this.restoreTokens();
            if (!result) {
                logger_1.default.error('Could not restore tokens for refresh');
                throw new Error('Could not restore tokens for refresh');
            }
            const data = await this.spotifyApi.refreshAccessToken();
            this.spotifyApi.setAccessToken(data.body.access_token);
            await this.saveTokens(data.body.access_token, data.body.refresh_token ?? result.refresh_token, data.body.expires_in);
            return data.body.access_token;
        }
        catch (err) {
            logger_1.default.error('Failed to refresh access tokens', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    //   // Initialize Spotify API with saved tokens
    async initializeSpotifyAPI() {
        try {
            await this.refreshAccessToken();
        }
        catch (err) {
            logger_1.default.error('Unable to initialize', {
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
    generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
exports.UserAuth = UserAuth;
