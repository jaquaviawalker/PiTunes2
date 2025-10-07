import { UserAuth } from '../src/UserAuth';
import { Request, Response } from 'express';

export function handleLogin(userAuth: UserAuth) {
  return (req: Request, res: Response) => {
    const authUrl = userAuth.startAuthFlow();
    res.redirect(authUrl);
  };
}

export function handleCallback(userAuth: UserAuth) {
  return async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).send('Missing authorization code');
      return;
    }
    try {
      userAuth['code'] = code;
      await userAuth.authenticateWithAuthCode();
      res.send('Authorization successful!');
    } catch (error) {
      res.status(500).send('Authorization failed');
    }
  };
}
