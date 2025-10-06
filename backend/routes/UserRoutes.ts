import { UserAuth } from '../src/UserAuth';
import logger from '../utils/logger';
import { Request, Response } from 'express';

export function handleLogin(req: Request, res: Response) {
  const client = new UserAuth();
  const authUrl = client.startAuthFlow();
  res.redirect(authUrl);
}

export async function handleCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }
  try {
    const client = new UserAuth();
    client['code'] = code;
    await client.authenticateWithAuthCode();
    res.send('Authorization successful!');
  } catch (error) {
    logger.error('Error during authentication', { error });
    res.status(500).send('Authentication failed');
  }
}
