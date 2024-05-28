import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
import { Community, CommunityTypes } from '../models/community.model';
// import { uploadSingleImage } from '../config/cloudinary';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utility/apiError';
import { v2 as cloudinary } from 'cloudinary';
import {
  COM_COOKIE_MISSING,
  COM_ALREADY_EXISTS,
  COM_INVALID_RF_TOKEN,
  COM_NOT_FOUND,
  COM_AUTHOR_NOT_FOUND,
} from '../utility/errorConstants';
import { tryCatch } from '../utility/tryCatch';
import { uploadOnCloudinary } from '../utility/cloudinary';
import User from '../models/user.model';
import { Post } from '../models/post.model';

interface decodedTypes {
  userId?: string;
}

// CREATE_COMMUNITY

const createCommunity = tryCatch(async (req: Request, res: Response) => {
  const { name: communityName, description } = req.body;
  const cookies = req.cookies;
  if (!cookies?.jwt)
    throw new ApiError('cookie missing', COM_COOKIE_MISSING, 403);

  const refreshToken = cookies?.jwt;

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as decodedTypes;

  if (!decodedToken) {
    throw new ApiError('Refresh Token Invalid', COM_INVALID_RF_TOKEN, 401);
  }

  let foundCommunity = await Community.findOne({ communityName });
  let foundAuthor = await User.findById(decodedToken.userId);

  if (foundCommunity) {
    throw new ApiError('Community Already Exists', COM_ALREADY_EXISTS, 403);
  }
  if (!foundAuthor) {
    throw new ApiError('Author not found', COM_AUTHOR_NOT_FOUND, 403);
  }

  const newCommunity = new Community({
    authorId: foundAuthor._id,
    authorName: foundAuthor.name,
    authorAvatar: foundAuthor.avatar,
    name: communityName,
    description,
    userId: foundAuthor._id,
    moderator: foundAuthor._id,
    members: foundAuthor._id,
  });
  await newCommunity.save();

  res.status(200).json({ message: 'success' });
});

// FIND_COMMUNITIES

const findCommunities = tryCatch(async (req: Request, res: Response) => {
  const { page } = req.params;
  const pageSize = 9;
  const skipItems = +page * 9;
  const foundCommunities = await Community.find()
    .skip(skipItems)
    .limit(pageSize)
    .sort();

  // .aggregate([
  //   {
  //     $group: {
  //       _id: null,
  //       maxMembers: {
  //         $max: '$members',
  //       },
  //       groups: {
  //         $push: '$$ROOT',
  //       },
  //     },
  //   },
  //   {
  //     $unwind: '$groups',
  //   },
  //   {
  //     $sort: { 'groups.members': -1 },
  //   },
  //   {
  //     $skip: skipItems,
  //   },
  //   {
  //     $limit: pageSize,
  //   },
  //   {
  //     $project: {
  //       name: '$groups.name',
  //       description: '$groups.description',
  //       _id: '$groups._id',
  //       author: '$groups.author',
  //       members: '$groups.members',
  //     },
  //   },
  // ]);

  res.status(200).send(foundCommunities);
});

const getCommunity = tryCatch(async (req: Request, res: Response) => {
  const { comId } = req.params;

  const foundCommunity = await Community.findOne({ name: comId });

  if (!foundCommunity)
    throw new ApiError('Community not found!', COM_NOT_FOUND, 404);

  res.status(200).send(foundCommunity);
});

const joinCommunity = tryCatch(async (req: Request, res: Response) => {
  const { communityName, userId } = req.body;

  const community = await Community.findOneAndUpdate(
    {
      name: communityName,
    },
    {
      $push: {
        members: userId,
      },
    },
    {
      new: true,
    }
  );

  if (!community) throw new ApiError('Not Joined', 907, 403);

  res.status(200).json({ message: 'done' });
});

const leaveCommunity = tryCatch(async (req: Request, res: Response) => {
  const { communityName, userId } = req.body;

  const community = await Community.findOneAndUpdate(
    {
      name: communityName,
    },
    {
      $pull: {
        members: userId,
      },
    },
    {
      new: true,
    }
  );

  if (!community) throw new ApiError('haven"t left', 907, 403);

  res.status(200).json({ message: 'done' });
});

const getCommunities = tryCatch(async (req: Request, res: Response) => {
  const userId = req.userId;

  const foundCommunities = await Community.find(
    {
      members: {
        $in: [userId],
      },
      authorId: {
        $ne: userId,
      },
    },
    {
      name: 1,
      description: 1,
      avatarImg: 1,
      author: 1,
      _id: 1,
    }
  ).lean();

  // if(!foundCommunities)

  res.status(200).send(foundCommunities);
});

const getModCommunities = tryCatch(async (req: Request, res: Response) => {
  const userId = req.userId;

  const foundModCommunities = await Community.find(
    {
      authorId: userId,
    },
    {
      name: 1,
      description: 1,
      avatarImg: 1,
      author: 1,
      _id: 1,
    }
  );

  res.status(200).send(foundModCommunities);
});

// type coverImgType =
interface uploadFile {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  // add other properties as needed
}

const editCommunity = tryCatch(async (req: Request, res: Response) => {
  const { name: newName, description, rules, communityName } = req.body;

  const foundCommunity = await Community.findOne({ name: communityName });

  if (!foundCommunity) return new ApiError('Community Not Found', 901, 404);

  if (req.userId !== foundCommunity.authorId.toString()) {
    throw new ApiError('User not allowed to edit community', 909, 403);
  }

  const imgFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
  const avatarImgPath = imgFiles.avatarImg[0].path;
  const coverImgPath = imgFiles.coverImg[0].path;

  if (avatarImgPath) {
    const url = await uploadOnCloudinary(avatarImgPath);
    if (!url) throw new ApiError('Error Uploading Image', 908, 403);
    foundCommunity.avatarImg = url;
  }

  if (coverImgPath) {
    const url = await uploadOnCloudinary(coverImgPath);
    if (!url) throw new ApiError('Error Uploading Image', 908, 403);
    foundCommunity.coverImg = url;
  }

  const splittedRulesArr = rules.split(',');

  foundCommunity.name = newName;
  foundCommunity.rules = splittedRulesArr;
  foundCommunity.description = description;

  await foundCommunity.save();

  res.status(200).json({ message: 'Edit successful' });
});

const deleteCommunity = tryCatch(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { communityName } = req.body;

  const foundCommunity = await Community.findOne({ name: communityName });

  if (foundCommunity?.authorId.toString() !== userId)
    return new ApiError('Invalid AC Token', 906, 403);

  await Post.deleteMany({ communityId: foundCommunity._id });

  await Community.findOneAndDelete({
    name: communityName,
  });
  // console.log(await deleteCommunity);

  // if (!deletedCommunity)
  //   return new ApiError('Error Deleting Community', 911, 401);

  res.status(200).json({ message: 'Community Deleted!' });
});

export {
  createCommunity,
  editCommunity,
  getCommunities,
  findCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  getModCommunities,
  deleteCommunity,
};
