import express, { Request, Response } from 'express';
import { createUserRouter } from './routes/UserRoutes'; // Note the .js extension for ES modules

const app = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

async function main() {
  const userRouter = await createUserRouter();
  app.use('/api', userRouter);

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
});
