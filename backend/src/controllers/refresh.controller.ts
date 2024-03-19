import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    return res.status(400).json({ message: 'token does not exist' });
  }

  const refreshToken = cookie.jwt;

  //   clearing the cookie token
  res.clearCookie('jwt', { httpOnly: true, secure: true });

  try {
    const foundUser = await User.findOne({ refreshToken });

    interface decodedTypes {
      username?: string;
    }
    const decodedCookieToken: decodedTypes = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as decodedTypes;

    console.log(decodedCookieToken);

    if (!foundUser) {
      if (decodedCookieToken) {
        // return res.status(400).json({ message: 'Something went wrong' });

        const hackedUser = await User.findOne({
          username: decodedCookieToken.username,
        });

        if (hackedUser) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      }
      return res.json({ message: 'error' });
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
      return res.json({ message: 'err' });
    }

    const newAccessToken = jwt.sign(
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

    res.json({ newAccessToken });
  } catch (error) {}
};
