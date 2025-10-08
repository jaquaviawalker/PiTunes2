import express from 'express';
import {
  handlePlayAlbum,
  handlePlaybackState,
  handlePlaybackControl,
} from '../controllers/PlaybackController';

const router = express.Router();

router.post('/play', handlePlayAlbum);
router.get('/playback', handlePlaybackState);
router.post('/playback/:action', handlePlaybackControl);

export default router;
