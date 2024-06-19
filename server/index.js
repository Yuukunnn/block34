import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { createTables } from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const startServer = async () => {
  await createTables();

  app.listen(port, () => {
    console.log(chalk.green(`server successfully listening on port ${port}`));
  });
};

startServer();
