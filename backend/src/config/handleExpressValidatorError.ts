import { Request } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utility/ApiError';
import { EXPRESS_VALIDATION } from '../utility/errorConstants';

export const handleValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = '';
    for (let i = 0; i < errors.array().length; i++) {
      error += `-${errors.array()[i].msg}`;
    }

    throw new ApiError(EXPRESS_VALIDATION, error, 403);
  }
};
