import User from '../models/user.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ message: errors.array() });
  }

  // TODO for Registration
  // 1. validation for req body
  // 2. check if user already exists
  // 3. store the user into DB
  // 4. create a jwt token
  // 5. send it back

  try {
    let user = await User.findOne({
      username: req.body.username,
    });

    if (user) {
      return res.status(400).json({ message: 'User Already Exists!' });
    }

    user = new User(req.body);
    await user.save();

    if (!user) {
      return res.status(500).json({ message: 'Something Went Wrong!' });
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
      maxAge: 259200000,
    });

    res.status(200).send({ message: 'User Registered Successfully!' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Something Went Wrong!' });
  }
};
