import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// LOGIN

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(403).json({ message: errors.array() });
  }

  const cookies = req.cookies;
  const { username, password } = req.body;

  try {
    let foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.sendStatus(403);
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401);
    }

    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '6h',
      }
    );

    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
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
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// LOGOUT

export const logout = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(403);

  const refreshToken = cookie?.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken });

    const decodedCookieToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    if (foundUser) {
      foundUser.refreshToken = foundUser.refreshToken.filter(
        (token) => token !== refreshToken
      );
      await foundUser.save();
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};
