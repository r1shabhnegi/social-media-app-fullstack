import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .catch((error) => console.log('DB ERROR ', error));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONT_URL as string }));
app.use(cookieParser());

app.use('/api/user', userRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log('Connected 9000');
});
