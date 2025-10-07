import { handleLogin, handleCallback } from '../controllers/UserControllers';
import express from 'express';

const router = express.Router();

router.get('/login', handleLogin);
router.get('/callback', handleCallback);

export default router;
