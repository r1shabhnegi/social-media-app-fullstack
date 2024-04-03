import User from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { tryCatch } from '../utility/tryCatch';
import { handleValidation } from '../config/handleExpressValidatorError';
import {
  AUTH_COOKIE_MISSING,
  AUTH_INVALID_PW,
  AUTH_USER_NOT_FOUND,
} from '../utility/errorConstants';
import { ApiError } from '../utility/apiError';

// SIGN-IN

export const signIn = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    handleValidation(req);

    const cookies = req.cookies;

    const { username, password } = req.body;

    let foundUser = await User.findOne({ username });
    if (!foundUser) {
      throw new ApiError('User Not Found', AUTH_USER_NOT_FOUND, 404);
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new ApiError('pw', AUTH_INVALID_PW, 401);
    }

    const accessToken = jwt.sign(
      {
        userId: foundUser._id.toString(),
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '6h',
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: foundUser._id.toString(),
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((token) => token !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }

    foundUser.refreshToken = [...newRefreshTokenArray, refreshToken];
    await foundUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, username: foundUser.username });
  }
);
// SIGN_OUT

export const signOut = tryCatch(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.jwt)
    throw new ApiError('cookie missing', AUTH_COOKIE_MISSING, 403);
  const refreshToken = cookie?.jwt;

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(204).json({ message: 'Clear!' });
  }
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.status(204).json({ message: 'Clear!' });
});
