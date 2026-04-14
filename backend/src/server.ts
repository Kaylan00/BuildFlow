import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { PORT } from './config';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Centralized error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('[server error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 BuildFlow API listening on http://localhost:${PORT}`);
});
