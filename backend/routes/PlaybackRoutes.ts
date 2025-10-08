import express from 'express';
import {
  handlePlayAlbum,
  handlePlaybackState,
} from '../controllers/PlaybackController';

const router = express.Router();

router.post('/play', handlePlayAlbum);
router.get('/playback', handlePlaybackState);

export default router;
