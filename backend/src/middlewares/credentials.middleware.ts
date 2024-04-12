import { NextFunction, Request, Response } from 'express';
import { allowedOrigin } from '../config/allowedOrigins';

export const credentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin;
  if (allowedOrigin.includes(origin as string)) {
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header({ ContentType: 'multipart/form-data' });
  }
  next();
};
