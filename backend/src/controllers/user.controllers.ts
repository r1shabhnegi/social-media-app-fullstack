import User from '../models/user.model';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utility/apiError';
import {
  USER_ALREADY_EXISTS,
  USER_ERROR_REGISTERING,
  USER_INVALID_CREDENTIALS,
} from '../utility/errorConstants';
import { tryCatch } from '../utility/tryCatch';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { signupInput } from '@rishabhnegi/circlesss-common';

export const signUp = tryCatch(async (req: Request, res: Response) => {
  const parsedInput = signupInput.safeParse(req.body);
  if (parsedInput.error) {
    throw new ApiError(
      'User Invalid Credentials',
      USER_INVALID_CREDENTIALS,
      401
    );
  }

  const name = parsedInput.data.name;
  const username = parsedInput.data.username;
  const email = parsedInput.data.email;
  const password = parsedInput.data.password;

  let foundUser = await User.findOne({ username });

  if (foundUser) {
    throw new ApiError('User already exists', USER_ALREADY_EXISTS, 403);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, username, email, password: hashedPassword });

  await newUser.save();

  if (!newUser) {
    throw new ApiError(
      'Something went wrong, retry registering',
      USER_ERROR_REGISTERING,
      404
    );
  }

  res.status(200).send({ message: 'User Sign Up Successful!' });
});

export const getUserData = tryCatch(async (req: Request, res: Response) => {
  const { username } = req.params;

  const userData = await User.findOne({ username }).select(
    '_id createdAt email name username'
  );
  if (!userData) throw new ApiError('Error', 3000, 3000);
  res.status(200).send(userData);
});

export const getUserProfilePosts = tryCatch(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const userPosts = await Post.find({ authorName: username }).sort({
      createdAt: -1,
    });

    res.status(200).send(userPosts);
  }
);

export const getUserProfileSaved = tryCatch(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const userSaved = await User.findOne({ username })
      .select('savedPosts')
      .sort({ createdAt: -1 });

    const posts = await Promise.all(
      userSaved?.savedPosts.map(async (postId) => {
        const savedPost = await Post.findById(postId);
        return savedPost;
      }) || []
    );
    const reversePosts = posts.reverse();

    res.status(200).send(posts);
  }
);

export const getUserProfileComments = tryCatch(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const userComments = await Comment.find({ authorName: username }).sort({
      createdAt: -1,
    });

    res.status(200).send(userComments);
  }
);

export const editUser = tryCatch(async (req: Request, res: Response) => {
  console.log(req.body);
});
