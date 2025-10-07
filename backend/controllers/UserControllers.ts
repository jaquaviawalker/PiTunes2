import { UserAuth } from '../src/UserAuth';
import { Request, Response } from 'express';

export function handleLogin(req: Request, res: Response) {
  const auth = new UserAuth();
  const authUrl = auth.startAuthFlow();
  res.redirect(authUrl);
}

export async function handleCallback(req: Request, res: Response) {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }
  try {
    const auth = new UserAuth();
    auth.setCode(code);
    await auth.authenticateWithAuthCode();
    res.send('Authorization successful!');
  } catch (error) {
    res.status(500).send('Authorization failed');
  }
}
