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
  console.log(authHeader);

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const accessToken = authHeader.split(' ')[1];

  const decodedAccessToken: decodedTypes = Jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as decodedTypes;
  console.log(decodedAccessToken);

  if (!decodedAccessToken) res.sendStatus(403);

  req.username = decodedAccessToken.username;
  next();
};
