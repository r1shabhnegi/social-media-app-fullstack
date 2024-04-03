import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';

export const handleErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  //   const message = error.message || 'Internal Server Error';

  return res.status(statusCode).json({ errorCode: error.errorCode });
};
