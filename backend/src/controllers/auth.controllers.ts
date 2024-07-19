import User from "../models/user.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
import { signinInput } from "@rishabhnegi/circlesss-common";
// import { ApiError } from "src/utility/apiError";
// import { tryCatch } from "src/utility/tryCatch";

// SIGN-IN

const signIn = async (req: Request, res: Response) => {
  try {
    const parsedInput = signinInput.safeParse(req.body);
    const username = parsedInput.data?.username;
    const password = parsedInput.data?.password;

    if (parsedInput.error) {
      return res.status(401).json({ error: "Invalid Credentials" });
      // throw new ApiError("Invalid Credentials", AUTH_INVALID_CREDENTIALS, 401);
    }

    let foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(404).json({ error: "User Not Found" });
      // throw new ApiError("User Not Found", AUTH_USER_NOT_FOUND, 404);
    }

    const isMatch = await bcrypt.compare(password || "", foundUser.password);

    if (!isMatch) {
      // throw new Error("PW");
      // throw new ApiError("pw", AUTH_INVALID_PW, 401);
      return res.status(401).json({ error: "pw" });
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
        sameSite: "none",
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
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
      username: foundUser.username,
      userId: foundUser._id,
      avatar: foundUser.avatar,
    });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

// Refresh Token

const refreshToken = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies;

    if (!cookie?.jwt) {
      // throw new Error("Cookie Missing");
      // throw new ApiError("Cookie Missing", RF_COOKIE_MISSING, 403);
      return res.status(403).json({ error: "Cookie Missing" });
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
      // throw new Error("Bad user request");
      // throw new ApiError("Bad user request", RF_INVALID_USER, 401);
      return res.status(401).json({ error: "Bad user request" });
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (token) => token !== refreshToken
    );

    if (!decodedToken) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      await foundUser.save();
    }

    if (!decodedToken || foundUser._id.toString() !== decodedToken.userId) {
      // throw new Error("Invalid Refresh Token");
      // throw new ApiError("Invalid Refresh Token", RF_INVALID_RF_TOKEN, 401);
      return res.status(401).json({ error: "Invalid Refresh Token" });
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
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
      username: foundUser.username,
      userId: foundUser._id,
      avatar: foundUser.avatar,
    });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

// SIGN_OUT

const signOut = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.status(403).json({ error: "cookie missing" });

    // throw new ApiError("cookie missing", AUTH_COOKIE_MISSING, 403);

    const refreshToken = cookie?.jwt;
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(204).json({ error: "Clear!" });
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(
      (token) => token !== refreshToken
    );
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    return res.status(200).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export { signIn, refreshToken, signOut };
