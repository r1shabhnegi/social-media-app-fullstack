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
} from '../utility/errorConstants';
import { tryCatch } from '../utility/tryCatch';
import { uploadOnCloudinary } from '../utility/cloudinary';

interface decodedTypes {
  userId?: string;
}

// CREATE_COMMUNITY

const createCommunity = tryCatch(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    throw new ApiError('cookie missing', COM_COOKIE_MISSING, 403);

  const refreshToken = cookies?.jwt;

  const { name, description } = req.body;

  let foundCommunity = await Community.findOne({ name });
  if (foundCommunity) {
    throw new ApiError('Community Already Exists', COM_ALREADY_EXISTS, 403);
  }

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as decodedTypes;

  if (!decodedToken) {
    throw new ApiError('Refresh Token Invalid', COM_INVALID_RF_TOKEN, 401);
  }

  const newCommunity = new Community({
    name,
    description,
    userId: decodedToken.userId,
    moderator: decodedToken.userId,
    members: decodedToken.userId,
    author: decodedToken.userId,
  });
  await newCommunity.save();

  res.status(200).json({ message: 'success' });
});

// FIND_COMMUNITIES

const findCommunities = tryCatch(async (req: Request, res: Response) => {
  const pageCount = +req.params.pageCount;
  const pageSize = 9;
  const skipItems = pageCount * 9;
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
  const { name } = req.params;

  const foundCommunity = await Community.findOne({ name });

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
      author: {
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
      author: userId,
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

declare global {
  namespace Express {
    interface Request {
      files?: {
        coverImg?: {
          path: string;
        }[];
        avatarImg?: {
          path: string;
        }[];
        image?: {
          path: string;
        }[];
      };
    }
  }
}

const editCommunity = tryCatch(async (req: Request, res: Response) => {
  const { name: newName, description, rules, communityName } = req.body;

  const foundCommunity = await Community.findOne({ name: communityName });

  if (!foundCommunity) return new ApiError('Community Not Found', 901, 404);

  if (req.userId !== foundCommunity.author.toString()) {
    throw new ApiError('User not allowed to edit community', 909, 403);
  }

  const avatarImgPath = (
    req as Request & { files?: { coverImg?: { path: string }[] } }
  ).files?.avatarImg?.[0]?.path;

  const coverImgPath = (
    req as Request & { files?: { coverImg?: { path: string }[] } }
  ).files?.coverImg?.[0]?.path;

  const uploadImageToCloudinary = async (imgPath: string) => {
    const response = await uploadOnCloudinary(imgPath);
    if (!response) throw new ApiError('Error Uploading Image', 908, 403);
    return response?.url;
  };

  if (avatarImgPath) {
    const url = await uploadImageToCloudinary(avatarImgPath);
    foundCommunity.avatarImg = url;
  }

  if (coverImgPath) {
    const url = await uploadImageToCloudinary(coverImgPath);
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
  console.log(userId, communityName);

  const foundCommunity = await Community.findOne({ name: communityName });

  if (foundCommunity?.author.toString() !== userId)
    return new ApiError('Invalid AC Token', 906, 403);

  const deletedCommunity = await Community.findOneAndDelete({
    name: communityName,
  }).then(() => {
    console.log(deleteCommunity);
  });
  // console.log(await deleteCommunity);

  // if (deletedCommunity)
  //   return new ApiError('Error Editing Community', 911, 401);

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
