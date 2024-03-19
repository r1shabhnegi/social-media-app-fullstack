import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      username: string;
    }
  }
}

interface decodedTypes {
  username: string;
}

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string;

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const accessToken = authHeader.split(' ')[1];

  const decodedAccessToken: decodedTypes = Jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as decodedTypes;

  if (!decodedAccessToken) res.send({ message: 'error' });

  req.username = decodedAccessToken.username;
  next();
};
