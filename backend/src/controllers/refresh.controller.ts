import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

interface decodedTypes {
  username?: string;
}

export const refreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    return res.status(403).json({ message: 'Invalid Cookie!' });
  }

  const refreshToken = cookie.jwt;

  res.clearCookie('jwt', { httpOnly: true, secure: true });

  try {
    const foundUser = await User.findOne({ refreshToken });

    const decodedCookieToken: decodedTypes = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as decodedTypes;

    if (!foundUser) {
      if (decodedCookieToken) {
        const hackedUser = await User.findOne({
          username: decodedCookieToken.username,
        });

        if (hackedUser) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      }
      return res.status(403).json({ message: 'Forbidden' });
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
      foundUser.username !== decodedCookieToken.username
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '6h',
      }
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
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

    res.json({ accessToken, username: foundUser.username });
  } catch (error) {
    res.status(500);
  }
};
