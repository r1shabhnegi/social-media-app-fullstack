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
import User from '../models/user.model';
import mongoose from 'mongoose';

const getNumberOfPosts = tryCatch(async (req: Request, res: Response) => {
  const numberOfPosts = await Post.countDocuments();
  res.status(200).send(numberOfPosts.toString());
});

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

  const author = await User.findById(req.userId);

  // console.log(author?.avatar);

  if (!author)
    throw new ApiError('user does not exist', POST_COMMUNITY_NOT_EXIST, 401);

  const newPost = new Post({
    title,
    content,
    authorId: req.userId,
    authorName: author.name,
    communityId: foundCommunity._id,
    communityName,
  });

  if (author?.avatar) {
    newPost.authorAvatar = author.avatar;
  }
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

const getAllCommunityPosts = tryCatch(async (req: Request, res: Response) => {
  const { id, page } = req.params;
  const skipPosts = +page * 5;
  const pageItems = 5;

  const foundPosts = await Post.find({
    communityId: id,
  })
    .skip(skipPosts)
    .limit(pageItems)
    .sort({ createdAt: -1 });

  if (!foundPosts) throw new ApiError('Posts Not Found', POST_NOT_FOUND, 404);

  res.status(200).json(foundPosts);
});

const getAllPosts = tryCatch(async (req: Request, res: Response) => {
  const { page } = req.params;
  const skipPosts = +page * 5;
  const pageItems = 5;

  const foundPosts = await Post.find()
    .skip(skipPosts)
    .limit(pageItems)
    .sort({ createdAt: -1 });

  res.status(200).send(foundPosts);
});

const getDetailPost = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  const foundPostDetail = await Post.findById(id);
  // console.log(foundPostDetail);

  res.status(200).send(foundPostDetail);
});

const getPostStats = tryCatch(async (req: Request, res: Response) => {
  const { postId, userId } = req.params;

  const foundVotes = await Post.findById(postId);

  let totalScore;
  if (foundVotes) {
    totalScore = foundVotes?.upVotes?.length - foundVotes?.downVotes?.length;
  }

  const foundUserUpvote = await Post.findOne(
    { _id: postId, upVotes: [userId] },
    {
      projection: { _id: 1 },
    }
  );
  const foundUserDownvote = await Post.findOne(
    { _id: postId, downVotes: [userId] },
    {
      projection: { _id: 1 },
    }
  );

  const isUpvoted = foundUserUpvote ? true : false;
  const isDownvoted = foundUserDownvote ? true : false;

  console.log(foundUserUpvote);

  res.status(200).send({ totalScore, isUpvoted, isDownvoted });
});

const handleUpVote = tryCatch(async (req: Request, res: Response) => {
  const { postId, userId } = req.body;
  console.log(postId);

  const foundDownVote = await Post.findOne(
    {
      _id: postId,
      downVotes: [userId],
    },
    {
      projection: { _id: 1 },
    }
  );

  if (foundDownVote) {
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { downVotes: userId } },
      { new: true }
    );
  }

  const foundUpvoteInPost = await Post.findOne(
    {
      _id: postId,
      upVotes: [userId],
    },
    {
      projection: { _id: 1 },
    }
  );

  if (!foundUpvoteInPost) {
    const upVoted = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { upVotes: userId },
      },
      {
        new: true,
      }
    );
    if (!upVoted) return new ApiError('Error up-voting the post', 1000, 1000);
  } else {
    const removedUpVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { upVotes: userId } },
      { new: true }
    );
    if (!removedUpVote)
      return new ApiError('Error up-voting the post', 1000, 1000);
  }
  res.status(200).json({ message: 'upVoted' });
});

const handleDownVote = tryCatch(async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

  // console.log(postId);

  const foundUpVote = await Post.findOne(
    {
      _id: postId,
      upVotes: [userId],
    },
    {
      projection: { _id: 1 },
    }
  );

  if (foundUpVote) {
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { upVotes: userId } },
      { new: true }
    );
  }

  const foundDownvoteInPost = await Post.findOne(
    {
      _id: postId,
      downVotes: [userId],
    },
    {
      projection: { _id: 1 },
    }
  );

  if (!foundDownvoteInPost) {
    const downVoted = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { downVotes: userId },
      },
      {
        new: true,
      }
    );
    if (!downVoted) return new ApiError('Error up-voting the post', 1000, 1000);
  } else {
    const removedDownVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { downVotes: userId } },
      { new: true }
    );
    if (!removedDownVote)
      return new ApiError('Error up-voting the post', 1000, 1000);
  }
  res.status(200).json({ message: 'downVoted' });
});
export {
  getNumberOfPosts,
  createPost,
  getAllCommunityPosts,
  getAllPosts,
  getDetailPost,
  getPostStats,
  handleUpVote,
  handleDownVote,
};
