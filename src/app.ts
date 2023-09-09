import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import cors from 'cors';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { JsonWebTokenError } from 'jsonwebtoken';

import { HttpError } from '@helpers';
import authRoutes from './routes/auth';
import contactsRoutes from './routes/contacts';

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// apply routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/users', authRoutes);

// non-existing route
app.use((_, res) => {
  res.status(404).json({ message: 'Route not found!' });
});

// error handler
app.use((err: Error | HttpError | ZodError, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'missing fields',
      details: fromZodError(err).message
    });
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  console.log(err.message);

  res.status(500).json({ message: 'Internal Server Error. Try again later!' });
});

export default app;
