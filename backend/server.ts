import express, { Request, Response } from 'express';
import UserRoutes from './routes/UserRoutes';
import MFRC522Routes from './routes/MFRC522Routes';
import PlaybackRoutes from './routes/PlaybackRoutes';
const app = express();
const port = 3000;
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', UserRoutes);
app.use('/api', MFRC522Routes);
app.use('/api', PlaybackRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
