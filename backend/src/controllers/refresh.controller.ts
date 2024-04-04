import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { tryCatch } from '../utility/tryCatch';
import { ApiError } from '../utility/apiError';
import {
  RF_COOKIE_MISSING,
  RF_INVALID_RF_TOKEN,
  RF_INVALID_USER,
} from '../utility/errorConstants';

interface decodedTypes {
  userId?: string;
}

export const refreshToken = tryCatch(async (req: Request, res: Response) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new ApiError('Cookie Missing', RF_COOKIE_MISSING, 403);
  }

  const refreshToken = cookie.jwt;

  res.clearCookie('jwt', { httpOnly: true, secure: true });

  const foundUser = await User.findOne({ refreshToken });

  const decodedCookieToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as decodedTypes;

  if (!foundUser) {
    if (decodedCookieToken) {
      const hackedUser = await User.findById(decodedCookieToken.userId);

      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    }
    throw new ApiError('Bad user request', RF_INVALID_USER, 401);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );

  if (!decodedCookieToken) {
    foundUser.refreshToken = [...newRefreshTokenArray];
    await foundUser.save();
  }

  if (
    !decodedCookieToken ||
    foundUser._id.toString() !== decodedCookieToken.userId
  ) {
    throw new ApiError('Invalid Refresh Token', RF_INVALID_RF_TOKEN, 401);
  }

  const accessToken = jwt.sign(
    { userId: foundUser._id.toString() },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '6h',
    }
  );

  const newRefreshToken = jwt.sign(
    { userId: foundUser._id.toString() },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '1d',
    }
  );
  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await foundUser.save();

  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, username: foundUser.username, userId: foundUser._id });
});
