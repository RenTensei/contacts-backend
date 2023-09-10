/* eslint-disable no-console */
import mongoose from 'mongoose';

import app from './app';

require('dotenv').config();

const { MONGO_CONNECTION_STRING, API_PORT } = process.env;

mongoose
  .connect(MONGO_CONNECTION_STRING || '')
  .then(() => {
    console.log('Database connection successful');
    app.listen(API_PORT, () => {
      console.log(`Server running. Use API on port: ${API_PORT}`);
    });
  })
  .catch((err: any) => {
    if (err instanceof Error) {
      console.log(err);
    }
    process.exit(1);
  });
