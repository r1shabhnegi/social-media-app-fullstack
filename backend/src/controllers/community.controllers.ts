import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Community, CommunityTypes } from '../models/community.model';
import { uploadSingleImage } from '../config/cloudinary';
import jwt from 'jsonwebtoken';

interface decodedTypes {
  username: string;
}

export const createCommunity = async (req: Request, res: Response) => {
  const { name } = req.params;

  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(403).json({ message: 'Invalid Credentials!' });
  }
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ message: errors.array() });
  // }

  const refreshToken = cookies?.jwt;

  const { name: communityName, description } = req.body;

  try {
    let community = await Community.findOne({
      name: communityName,
    });
    if (community) {
      return res.status(403).json({ message: 'Community Already Exists' });
    }

    const decodedToken: decodedTypes = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as decodedTypes;

    if (!decodedToken) {
      return res.status(400).json({ message: 'User Invalidate!' });
    }

    // const imageUrl = uploadSingleImage(req.body.imageUrl);

    // newCommunity.avatar = imageUrl;
    // newCommunity.userId = req.body.userId;

    community = new Community({
      // author: decodedToken.username,
      name: communityName,
      description: description,
    });
    community.save();

    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};
