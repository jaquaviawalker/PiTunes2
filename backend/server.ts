import express, { Request, Response } from 'express';
import { handleLogin, handleCallback } from './routes/UserRoutes';

const app = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/login', handleLogin);
app.get('/callback', handleCallback);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
