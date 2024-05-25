import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      username: string;
    }
  }
}

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Invalid Header!' });

  const accessToken = authHeader.split(' ')[1];

  const decodedAccessToken = Jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as JwtPayload;

  if (!decodedAccessToken)
    res.status(403).json({ message: 'Invalid Credentials!' });

  req.userId = decodedAccessToken.userId;
  req.username = decodedAccessToken.username;
  next();
};
