import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ApiError } from '../utility/ApiError';

export const errorHandler = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log(error.stack);

  if (error)
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ Err: { errorCode: error.errorCode, message: error.message } });
    }
  return res.status(500).json({ message: 'Internal Server Error!' });
};
