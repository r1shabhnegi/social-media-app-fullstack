import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(500).json({ message: 'User Does not Exists!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password Is Wrong!' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '3d',
      }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    });

    res.status(200).send({ message: 'Sign In Successfully!' });
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
