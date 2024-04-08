import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Community, CommunityTypes } from '../models/community.model';
import { uploadSingleImage } from '../config/cloudinary';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utility/apiError';
import {
  COM_COOKIE_MISSING,
  COM_ALREADY_EXISTS,
  COM_INVALID_RF_TOKEN,
  COM_NOT_FOUND,
} from '../utility/errorConstants';
import { tryCatch } from '../utility/tryCatch';

interface decodedTypes {
  userId?: string;
}

// CREATE_COMMUNITY

export const createCommunity = tryCatch(async (req: Request, res: Response) => {
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
    moderator: decodedToken.userId,
    members: decodedToken.userId,
    author: decodedToken.userId,
  });
  await newCommunity.save();

  res.status(200).json({ message: 'success' });
});

// FIND_COMMUNITIES

export const findCommunities = tryCatch(async (req: Request, res: Response) => {
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

export const getCommunity = tryCatch(async (req: Request, res: Response) => {
  const communityName = req.params.name;

  const foundCommunity = await Community.find({ name: communityName });
  // console.log(foundCommunity);

  if (!foundCommunity)
    throw new ApiError('Community not found!', COM_NOT_FOUND, 404);

  res.status(200).send(foundCommunity);
});

export const joinCommunity = tryCatch(async (req: Request, res: Response) => {
  // console.log(req.body);
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

export const getCommunities = tryCatch(async (req: Request, res: Response) => {
  const userId = req.userId;
  console.log(userId);

  const communities = await Community.find({
    members: {
      $in: [userId],
    },
  })
    .select('name _id')
    .lean();

  res.status(200).send(communities);
});
