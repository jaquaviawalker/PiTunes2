import { handleLogin, handleCallback } from '../controllers/UserControllers';
import { UserAuth } from '../src/UserAuth';
import express from 'express';

export async function createUserRouter() {
  const router = express.Router();
  const auth = new UserAuth();
  await auth.initializeSpotifyAPI();

  router.get('/login', handleLogin(auth));
  router.get('/callback', handleCallback(auth));

  return router;
}
