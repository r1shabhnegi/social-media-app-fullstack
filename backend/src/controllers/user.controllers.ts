import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utility/apiError';
import {
  USER_ALREADY_EXISTS,
  USER_ERROR_REGISTERING,
} from '../utility/errorConstants';
import { tryCatch } from '../utility/tryCatch';

export const signUp = tryCatch(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ message: errors.array() });
  }

  let foundUser = await User.findOne({
    username: req.body.username,
  });

  if (foundUser) {
    throw new ApiError('User already exists', USER_ALREADY_EXISTS, 403);
  }

  const newUser = new User(req.body);
  await newUser.save();

  if (!newUser) {
    throw new ApiError(
      'Something went wrong, retry registering',
      USER_ERROR_REGISTERING,
      404
    );
  }

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '3d',
    }
  );

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 259200000,
  });

  res.status(200).send({ message: 'User Sign Up Successful!' });
});
