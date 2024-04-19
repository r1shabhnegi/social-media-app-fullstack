import { Response, Request } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { Post } from '../models/post.model';
import { uploadOnCloudinary } from '../utility/cloudinary';
import { ApiError } from '../utility/apiError';
import { Community } from '../models/community.model';
import {
  POST_COMMUNITY_NOT_EXIST,
  POST_NOT_CREATED,
  POST_NOT_FOUND,
} from '../utility/errorConstants';

const createPost = tryCatch(async (req: Request, res: Response) => {
  const { title, content, communityName } = req.body;
  const image = req.files;

  const foundCommunity = await Community.findOne({ name: communityName });

  if (!foundCommunity)
    throw new ApiError(
      'community does not exist',
      POST_COMMUNITY_NOT_EXIST,
      401
    );

  const newPost = new Post({
    title,
    content,
    author: req.userId,
    community: foundCommunity._id,
  });

  const imagePath = (
    req as Request & { files?: { coverImg?: { path: string }[] } }
  ).files?.image?.[0]?.path;

  const uploadImageToCloudinary = async (imgPath: string) => {
    const response = await uploadOnCloudinary(imgPath);
    if (!response) throw new ApiError('Error Uploading Image', 908, 403);
    return response?.url;
  };

  if (imagePath) {
    const imageUrl = await uploadImageToCloudinary(imagePath);
    newPost.image = imageUrl;
  }
  await newPost.save();

  if (!newPost)
    throw new ApiError('Error Uploading Image', POST_NOT_CREATED, 401);

  res.status(200).json({ message: 'Post Created Successfully' });
});

const getCommunityPosts = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  const foundPosts = await Post.find({
    community: id,
  });

  if (!foundPosts) throw new ApiError('Posts Not Found', POST_NOT_FOUND, 404);

  res.status(200).json(foundPosts);
});

export { createPost, getCommunityPosts };
