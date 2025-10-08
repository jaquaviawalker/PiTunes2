import express from 'express';
import {
  handleScanToAlbum,
  handleSearchAlbums,
} from '../controllers/MFRC522Controller';

const router = express.Router();

router.post('/scan', handleScanToAlbum);
router.get('/search', handleSearchAlbums);

export default router;
