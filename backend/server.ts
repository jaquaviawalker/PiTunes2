import express, { Request, Response } from 'express';
import UserRoutes from './routes/UserRoutes';
import MFRC522Routes from './routes/MFRC522Routes';
import PlaybackRoutes from './routes/PlaybackRoutes';
import MappingRoutes from './routes/MappingRoutes';
import cors from 'cors';
const app = express();

const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', UserRoutes);
app.use('/api', MFRC522Routes);
app.use('/api', PlaybackRoutes);
app.use('/api', MappingRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
