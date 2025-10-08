"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlayAlbum = handlePlayAlbum;
exports.handlePlaybackState = handlePlaybackState;
exports.handlePlaybackControl = handlePlaybackControl;
const AlbumMapping_1 = require("../src/AlbumMapping");
const MFRC522Scanner_1 = require("../src/MFRC522Scanner");
const SpotifyClient_1 = require("../src/SpotifyClient");
const logger_1 = __importDefault(require("../utils/logger"));
async function handlePlayAlbum(req, res) {
    logger_1.default.info('Album playback requested');
    try {
        const albumMapping = await AlbumMapping_1.AlbumMapping.create();
        const scanner = new MFRC522Scanner_1.Mfrc522Scanner();
        const albumId = await scanner.scanAlbum(albumMapping);
        logger_1.default.info('Album scanned successfully', { albumId });
        const client = new SpotifyClient_1.SpotifyClient();
        const device = await client.getAvailableDevices();
        if (!device) {
            logger_1.default.warn('No Spotify devices available');
            return res.status(400).json({
                success: false,
                message: 'No Spotify devices available. Please open Spotify on a device first.',
            });
        }
        client.setAlbumId(albumId);
        client.setDeviceId(device.id);
        await client.playAlbum();
        logger_1.default.info('Album playback successful', {
            albumId,
            deviceName: device.name,
        });
        res.status(200).json({
            success: true,
            message: `Album is now playing on ${device.name}`,
        });
    }
    catch (error) {
        logger_1.default.error('Error playing album', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        if (error instanceof Error && error.message.includes('authentication')) {
            logger_1.default.error('Spotify authentication failed', { error: error.message });
            return res.status(401).json({
                success: false,
                error: 'Authentication with Spotify failed',
            });
        }
        if (error instanceof Error && error.message.includes('scanner')) {
            logger_1.default.error('RFID scanner error', { error: error.message });
            return res.status(500).json({
                success: false,
                error: 'RFID scanner error occurred',
            });
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
async function handlePlaybackState(req, res) {
    logger_1.default.info('getting playback state');
    try {
        const client = new SpotifyClient_1.SpotifyClient();
        const state = await client.getPlaybackState();
        if (state == null) {
            logger_1.default.warn('No playback state available');
            return res.status(400).json({
                success: false,
                message: 'No playback state available',
            });
        }
        logger_1.default.info('State loaded successfully', {});
        res.status(200).json({
            success: true,
            state,
        });
    }
    catch (error) {
        logger_1.default.error('Error getting playback state', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        if (error instanceof Error && error.message.includes('authentication')) {
            logger_1.default.error('Spotify authentication failed', { error: error.message });
            return res.status(401).json({
                success: false,
                error: 'Authentication with Spotify failed',
            });
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
async function handlePlaybackControl(req, res) {
    const { action } = req.params;
    try {
        if (!action) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a playback action',
            });
        }
        const client = new SpotifyClient_1.SpotifyClient();
        await client.playbackControl(action);
        res.status(200).json({
            success: true,
            message: `Playback action '${action}' executed successfully`,
        });
    }
    catch (error) {
        logger_1.default.error('Error controlling playback', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        if (error instanceof Error &&
            error.message.includes('Unknown playback action')) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
        if (error instanceof Error && error.message.includes('authentication')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication with Spotify failed',
            });
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
//POST /api/playback/:action
