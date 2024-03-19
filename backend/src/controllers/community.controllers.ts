import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Community, CommunityTypes } from '../models/community.model';
import { uploadSingleImage } from '../utility/cloudinary';

export const createCommunity = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { name, description, imageUrls, userId, rule } = req.body;

  try {
    const newCommunity: CommunityTypes = req.body;

    let community = await Community.findOne({
      name: newCommunity.name,
    });
    if (community) {
      return res.status(400).json({ message: 'Community Already Exists' });
    }

    // const imageUrl = uploadSingleImage(req.body.imageUrl);

    // newCommunity.avatar = imageUrl;
    // newCommunity.userId = req.body.userId;
    community = new Community(newCommunity);
    community.save();
    res.send({ message: 'success' });
    // community.userId = req.body.userId;

    // communit;'
  } catch (error) {
    console.log(error);
  }
};
