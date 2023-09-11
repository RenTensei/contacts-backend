/* eslint-disable no-console */
import mongoose from 'mongoose';

import app from './app';

require('dotenv').config();

const { MONGO_CONNECTION_STRING, API_PORT, PRODUCTION_PORT, NODE_ENV } = process.env;

const APP_PORT = NODE_ENV === 'production' ? PRODUCTION_PORT : API_PORT;
console.log(APP_PORT);

mongoose
  .connect(MONGO_CONNECTION_STRING || '')
  .then(() => {
    console.log('Database connection successful');
    app.listen(APP_PORT, () => {
      console.log(`Server running. Use API on port: ${APP_PORT}`);
    });
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.log(err);
    }
    process.exit(1);
  });
