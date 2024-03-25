import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// SIGN-IN

export const signIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ message: errors.array() });
  }

  const cookies = req.cookies;
  const { username, password } = req.body;

  try {
    let foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(403).json({ message: 'User Not Found!' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials!' });
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
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

// SIGN_OUT

export const signOut = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.jwt)
    return res.status(403).json({ message: 'Credentials Missing!' });

  const refreshToken = cookie?.jwt;

  console.log(refreshToken);
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};
