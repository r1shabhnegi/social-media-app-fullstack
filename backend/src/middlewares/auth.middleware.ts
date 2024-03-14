import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['auth_token'];

  if (!token) {
    return res.status(400).json({ message: 'Unauthorized!' });
  }

  try {
    const decode = Jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    req.userId = (decode as JwtPayload).userId;

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Unauthorized!' });
  }
};
