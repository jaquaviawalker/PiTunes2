"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScanToAlbum = handleScanToAlbum;
exports.handleSearchAlbums = handleSearchAlbums;
const logger_1 = __importDefault(require("../utils/logger"));
const AlbumMapping_1 = require("../src/AlbumMapping");
const MFRC522Scanner_1 = require("../src/MFRC522Scanner");
const SpotifyClient_1 = require("../src/SpotifyClient");
async function handleScanToAlbum(req, res) {
    const { album, artist } = req.body;
    let uid;
    try {
        if (!album || !artist) {
            return res.status(400).json({
                success: false,
                message: 'Album name and artist are required',
            });
        }
        const client = new SpotifyClient_1.SpotifyClient();
        const albums = await client.searchAlbum(album);
        if (!Array.isArray(albums) || albums.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No albums found for the given album name.',
            });
        }
        const match = albums.find((albumItem) => albumItem.artists.some((artistItem) => artistItem.name.trim().toLowerCase() === artist.toLowerCase()));
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'No matching album found for artist',
            });
        }
        const albumId = match.id;
        const releaseDate = match.release_date
            ? new Date(match.release_date)
            : undefined;
        const metadata = {
            albumName: match.name,
            artistName: match.artists?.[0]?.name || 'Unknown Artist',
            imageUrl: match.images?.[0]?.url || '',
            releaseDate: releaseDate, // Now a Date object or undefined
        };
        logger_1.default.info('Waiting for card scan...', { album, artist });
        const mfrc522 = new MFRC522Scanner_1.Mfrc522Scanner();
        const scanResult = mfrc522.readCard();
        if (!scanResult.success) {
            return res.status(400).json({
                success: false,
                message: scanResult.message || 'Failed to scan card',
            });
        }
        uid = scanResult.uid;
        const instance = await AlbumMapping_1.AlbumMapping.create();
        await instance.addMapping(uid, albumId, metadata);
        res.status(200).json({
            success: true,
            uid: uid,
            albumId: albumId,
            albumName: match.name,
            artist: match.artists[0]?.name,
            message: `Card ${uid} mapped to "${match.name}" by ${match.artists[0]?.name}`,
        });
    }
    catch (error) {
        logger_1.default.error('Error in scanToAlbum', {
            error: error instanceof Error ? error.message : 'Unknown error',
            uid: uid || 'not scanned',
            album,
            artist,
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
//handleSearchAlbums
async function handleSearchAlbums(req, res) {
    const album = req.query.album;
    const artist = req.query.artist;
    if (!album && !artist) {
        return res.status(400).json({
            success: false,
            message: 'Please provide either album name or artist name for search',
        });
    }
    const searchQuery = artist ? `${album || ''} artist:${artist}` : album;
    try {
        const client = new SpotifyClient_1.SpotifyClient();
        const albums = await client.searchAlbum(searchQuery);
        res.json({
            success: true,
            albums,
        });
    }
    catch (error) {
        logger_1.default.error('Error searching albums', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
// GET /api/search
