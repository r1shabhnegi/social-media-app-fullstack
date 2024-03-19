import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import communityRouter from './routes/community.routes';
import refreshRouter from './routes/refresh.routes';
import { verifyJwt } from './middlewares/auth.middleware';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .catch((error) => console.log('DB ERROR ', error));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONT_URL as string }));
app.use(cookieParser());

app.use(verifyJwt);

app.use('/refresh', refreshRouter);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/community', communityRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log('Connected on port:', process.env.SERVER_PORT);
});
