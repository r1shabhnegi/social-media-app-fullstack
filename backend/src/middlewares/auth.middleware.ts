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

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Invalid Header!' });

  const accessToken = authHeader.split(' ')[1];

  const decodedAccessToken: decodedTypes = Jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as decodedTypes;
  console.log(decodedAccessToken);

  if (!decodedAccessToken)
    res.status(403).json({ message: 'Invalid Credentials!' });

  req.username = decodedAccessToken.username;
  next();
};
