import express from 'express';
import { handleScanToAlbum } from '../controllers/MFRC522Controller';

const router = express.Router();

router.post('/scan', handleScanToAlbum);

export default router;
