import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { tryCatch } from "../utility/tryCatch";
import { JwtPayload } from "jsonwebtoken";
import {
  AUTH_COOKIE_MISSING,
  AUTH_INVALID_CREDENTIALS,
  AUTH_INVALID_PW,
  AUTH_USER_NOT_FOUND,
  RF_COOKIE_MISSING,
  RF_INVALID_RF_TOKEN,
  RF_INVALID_USER,
} from "../utility/errorConstants";
import { ApiError } from "../utility/apiError";
import { signinInput } from "@rishabhnegi/circlesss-common";

// SIGN-IN

const signIn = tryCatch(async (req: Request, res: Response) => {
  const parsedInput = signinInput.safeParse(req.body);
  const username = parsedInput.data?.username;
  const password = parsedInput.data?.password;

  if (parsedInput.error) {
    throw new ApiError("Invalid Credentials", AUTH_INVALID_CREDENTIALS, 401);
  }

  let foundUser = await User.findOne({ username });

  if (!foundUser) {
    throw new ApiError("User Not Found", AUTH_USER_NOT_FOUND, 404);
  }

  const isMatch = await bcrypt.compare(password || "", foundUser.password);

  if (!isMatch) {
    throw new ApiError("pw", AUTH_INVALID_PW, 401);
  }

  const cookies = req.cookies;

  let newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((token) => token !== cookies.jwt);

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();

    if (!foundToken) {
      newRefreshTokenArray = [];
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  }

  const refreshToken = jwt.sign(
    {
      userId: foundUser._id.toString(),
      userName: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  foundUser.refreshToken = [...newRefreshTokenArray, refreshToken];
  await foundUser.save();

  const accessToken = jwt.sign(
    {
      userId: foundUser._id.toString(),
      userName: foundUser.username,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "6h",
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    accessToken,
    username: foundUser.username,
    userId: foundUser._id,
  });
});

// Refresh Token

const refreshToken = tryCatch(async (req: Request, res: Response) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new ApiError("Cookie Missing", RF_COOKIE_MISSING, 403);
  }

  res.clearCookie("jwt", { httpOnly: true, secure: true });

  const refreshToken: string = cookie.jwt;

  const foundUser = await User.findOne({ refreshToken });

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;

  if (!foundUser) {
    if (decodedToken) {
      const hackedUser = await User.findById(decodedToken.userId);

      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    }
    throw new ApiError("Bad user request", RF_INVALID_USER, 401);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );

  if (!decodedToken) {
    foundUser.refreshToken = [...newRefreshTokenArray];
    await foundUser.save();
  }

  if (!decodedToken || foundUser._id.toString() !== decodedToken.userId) {
    throw new ApiError("Invalid Refresh Token", RF_INVALID_RF_TOKEN, 401);
  }

  const newRefreshToken = jwt.sign(
    { userId: foundUser._id.toString(), username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await foundUser.save();

  const accessToken = jwt.sign(
    { userId: foundUser._id.toString(), username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "6h",
    }
  );

  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    username: foundUser.username,
    userId: foundUser._id,
  });
});

// SIGN_OUT

const signOut = tryCatch(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  // if (!cookie?.jwt)
  //   throw new ApiError('cookie missing', AUTH_COOKIE_MISSING, 403);

  const refreshToken = cookie?.jwt;
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return res.status(204).json({ message: "Clear!" });
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: true });

  res.status(200).json({ message: "success!" });
});

export { signIn, refreshToken, signOut };
