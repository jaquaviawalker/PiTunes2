import { AlbumMapping } from '../src/AlbumMapping';
import { Mfrc522Scanner } from '../src/MFRC522Scanner';
import { SpotifyClient } from '../src/SpotifyClient';
import logger from '../utils/logger';
import { Request, Response } from 'express';

export async function handlePlayAlbum(req: Request, res: Response) {
  logger.info('Album playback requested');
  try {
    const albumMapping = await AlbumMapping.create();
    const scanner = new Mfrc522Scanner();
    const albumId = await scanner.scanAlbum(albumMapping);
    logger.info('Album scanned successfully', { albumId });

    const client = new SpotifyClient();
    const device = await client.getAvailableDevices();
    if (!device) {
      logger.warn('No Spotify devices available');
      return res.status(400).json({
        success: false,
        message:
          'No Spotify devices available. Please open Spotify on a device first.',
      });
    }
    client.setAlbumId(albumId);
    client.setDeviceId(device.id);

    await client.playAlbum();
    logger.info('Album playback successful', {
      albumId,
      deviceName: device.name,
    });
    res.status(200).json({
      success: true,
      message: `Album is now playing on ${device.name}`,
    });
  } catch (error) {
    logger.error('Error playing album', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.message.includes('authentication')) {
      logger.error('Spotify authentication failed', { error: error.message });
      return res.status(401).json({
        success: false,
        error: 'Authentication with Spotify failed',
      });
    }

    if (error instanceof Error && error.message.includes('scanner')) {
      logger.error('RFID scanner error', { error: error.message });
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
