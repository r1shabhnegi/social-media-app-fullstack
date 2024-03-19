import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ message: errors.array() });
  // }

  const cookies = req.cookies;
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(500).json({ message: 'User Does not Exists!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password Is Wrong!' });
    }

    const accessToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '6h',
      }
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((token) => token !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
      });
    }

    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Something Went Wrong!' });
  }
};

export const logout = (_: any, res: Response) => {
  try {
    res.cookie('auth_token', '', {
      expires: new Date(),
    });
    res.send({ message: 'Logout Successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Something Went Wrong!' });
  }
};
export const validateToken = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
};
