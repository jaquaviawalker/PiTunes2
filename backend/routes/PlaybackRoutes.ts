import express from 'express';
import { handlePlayAlbum } from '../controllers/PlaybackController';

const router = express.Router();

router.post('/play', handlePlayAlbum);

export default router;
