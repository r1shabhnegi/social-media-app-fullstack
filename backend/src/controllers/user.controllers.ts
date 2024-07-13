import User from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import { ApiError } from "../utility/apiError";
// import {
//   USER_ALREADY_EXISTS,
//   USER_ERROR_REGISTERING,
//   USER_INVALID_CREDENTIALS,
// } from "../utility/errorConstants";
// import { tryCatch } from "../utility/tryCatch";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { signupInput } from "@rishabhnegi/circlesss-common";
import { uploadOnCloudinary } from "../utility/cloudinary";
import { redis } from "../utility/redis";

export const signUp = async (req: Request, res: Response) => {
  try {
    const parsedInput = signupInput.safeParse(req.body);
    if (parsedInput.error) {
      // throw new Error("User Invalid Credentials");
      return res.status(401).json({ error: "User Invalid Credentials" });
      // throw new ApiError(
      //   "User Invalid Credentials",
      //   USER_INVALID_CREDENTIALS,
      //   401
      // );
    }

    const name = parsedInput.data.name;
    const username = parsedInput.data.username;
    const email = parsedInput.data.email;
    const password = parsedInput.data.password;

    let foundUser = await User.findOne({ username });

    if (foundUser) {
      // throw new Error("User already exists");
      return res.status(403).json({ error: "User already exists" });
      // throw new ApiError("User already exists", USER_ALREADY_EXISTS, 403);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (!newUser) {
      // throw new Error("Something went wrong, retry registering");
      return res
        .status(404)
        .json({ error: "Something went wrong, retry registering" });
      // throw new ApiError(
      //   "Something went wrong, retry registering",
      //   USER_ERROR_REGISTERING,
      //   404
      // );
    }

    res.status(200).send({ message: "User Sign Up Successful!" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const cachedUser = await redis.get(`user:${username}`);

    if (cachedUser) {
      res.status(200).send(JSON.parse(cachedUser));
      return;
    }

    const userData = await User.findOne({ username }).select(
      "_id createdAt bio email name username avatar"
    );

    if (!userData) return res.status(500).json({ error: "Err" });
    //  throw new ApiError("Error", 3000, 3000);

    await redis.set(`user:${username}`, JSON.stringify(userData), "EX", 1800);

    res.status(200).send(userData);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export const getUserProfilePosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const cachedPosts = await redis.get(`profilePosts:${username}`);

    if (cachedPosts) {
      res.status(200).send(JSON.parse(cachedPosts));
    }

    const userPosts = await Post.find({ authorName: username }).sort({
      createdAt: -1,
    });
    if (!userPosts) {
      throw new Error("user posts not found");
    }

    await redis.set(
      `profilePosts:${username}`,
      JSON.stringify(userPosts),
      "EX",
      1800
    );

    res.status(200).send(userPosts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export const getUserProfileSaved = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const userSaved = await User.findOne({ username })
      .select("savedPosts")
      .sort({ createdAt: -1 });

    const posts = await Promise.all(
      userSaved?.savedPosts.map(async (postId) => {
        const savedPost = await Post.findById(postId);
        return savedPost;
      }) || []
    );
    const reversePosts = posts.reverse();

    res.status(200).send(posts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
export const getUserProfileComments = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const userComments = await Comment.find({ authorName: username }).sort({
      createdAt: -1,
    });

    res.status(200).send(userComments);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const userId = req.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new Error("User not found");
    }

    const avatarFile = req.files as {
      [fieldName: string]: Express.Multer.File[];
    };

    const avatarPath = avatarFile.avatar[0].path;

    if (avatarPath) {
      const url = await uploadOnCloudinary(avatarPath);

      if (!url) throw new Error("Error uploading file");
      foundUser.avatar = url;
    }

    foundUser.name = name;
    foundUser.bio = description;

    await foundUser.save();
    res.status(200).json({ message: "Edit successful!" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
