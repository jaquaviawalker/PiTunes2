import { Response, Request } from 'express';
import logger from '../utils/logger';
import { AlbumMapping } from '../src/AlbumMapping';
import { Mfrc522Scanner } from '../src/MFRC522Scanner';
import { SpotifyClient } from '../src/SpotifyClient';

export async function handleScanToAlbum(req: Request, res: Response) {
  const { album, artist } = req.body;
  let uid: string | undefined;
  try {
    if (!album || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Album name and artist are required',
      });
    }
    const client = new SpotifyClient();
    const albums = await client.searchAlbum(album);

    if (!Array.isArray(albums) || albums.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No albums found for the given album name.',
      });
    }

    const match = albums.find((albumItem) =>
      albumItem.artists.some(
        (artistItem) =>
          artistItem.name.trim().toLowerCase() === artist.toLowerCase()
      )
    );
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'No matching album found for artist',
      });
    }
    const albumId = match.id;

    logger.info('Waiting for card scan...', { album, artist });
    const mfrc522 = new Mfrc522Scanner();
    const scanResult = mfrc522.readCard();

    if (!scanResult.success) {
      return res.status(400).json({
        success: false,
        message: scanResult.message || 'Failed to scan card',
      });
    }

    uid = scanResult.uid;

    const instance = await AlbumMapping.create();
    await instance.addMapping(uid, albumId);

    res.status(200).json({
      success: true,
      uid: uid,
      albumId: albumId,
      albumName: match.name,
      artist: match.artists[0]?.name,
      message: `Card ${uid} mapped to "${match.name}" by ${match.artists[0]?.name}`,
    });
  } catch (error) {
    logger.error('Error in scanToAlbum', {
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
