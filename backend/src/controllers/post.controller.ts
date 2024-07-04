import { Response, Request } from 'express';
// import { tryCatch } from '../utility/tryCatch';
import { Post } from '../models/post.model';
import { uploadOnCloudinary } from '../utility/cloudinary';
// import { ApiError } from '../utility/apiError';
import { Community } from '../models/community.model';
import {
  POST_COMMUNITY_NOT_EXIST,
  POST_NOT_CREATED,
  POST_NOT_FOUND,
} from '../utility/errorConstants';
import User from '../models/user.model';
import mongoose from 'mongoose';
import { Comment } from '../models/comment.model';

const getNumberOfPosts =
//  tryCatch(
  async (req: Request, res: Response) => {
  const numberOfPosts = await Post.countDocuments();
  res.status(200).send(numberOfPosts.toString());
}
// );

const createPost =
//  tryCatch(
  async (req: Request, res: Response) => {
  const { title, content, communityName } = req.body;
  const image = req.files;

  const foundCommunity = await Community.findOne({ name: communityName });

  if (!foundCommunity)
    throw new Error('community does not exist')
  // ApiError(
  //     'community does not exist',
  //     POST_COMMUNITY_NOT_EXIST,
  //     401
  //   );

  const author = await User.findById(req.userId);

  // console.log(author?.avatar);

  if (!author)
    throw new Error('user does not exist')
  // ApiError('user does not exist', POST_COMMUNITY_NOT_EXIST, 401);

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
  const imageFile = req.files as { [fieldName: string]: Express.Multer.File[] };

  const imagePath = imageFile.image[0].path;
  if (imagePath) {
    const url = await uploadOnCloudinary(imagePath);
    if (!url) throw new Error('Error Uploading Image') 
    //  ApiError('Error Uploading Image', 908, 403);
    newPost.image = url;
  }

  await newPost.save();

  if (!newPost)
    throw new Error('Error Uploading Image')
  // ApiError('Error Uploading Image', POST_NOT_CREATED, 401);

  res.status(200).json({ message: 'Post Created Successfully' });
}
// );

const getAllCommunityPosts =
//  tryCatch(
  async (req: Request, res: Response) => {
  const { page, communityId } = req.params;
  const skipPosts = +page * 5;
  const pageItems = 5;
  const foundPosts = await Post.find({
    communityId,
  })
    .skip(skipPosts)
    .limit(pageItems)
    .sort({ createdAt: -1 });

  if (!foundPosts) throw new Error('Posts Not Found') 
  // ApiError('Posts Not Found', POST_NOT_FOUND, 404);

  res.status(200).json(foundPosts);
}
// );

const getAllPosts = 
// tryCatch(
  async (req: Request, res: Response) => {
  const { page } = req.params;
  const skipPosts = +page * 5;
  const pageItems = 5;

  const foundPosts = await Post.find()
    .skip(skipPosts)
    .limit(pageItems)
    .sort({ createdAt: -1 });

  res.status(200).send(foundPosts);
}
// );

const getDetailsPost =
//  tryCatch(
  async (req: Request, res: Response) => {
  const { postId } = req.params;

  const foundPostDetail = await Post.findById(postId);
  // console.log(foundPostDetail);

  res.status(200).send(foundPostDetail);
}
// );

const getPostStats =
//  tryCatch(
  async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.userId;
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

  const savedPost = await User.findOne(
    { _id: userId, savedPosts: postId },
    { projection: { _id: 1 } }
  );

  const postSaved = !!savedPost?._id;

  const isUpvoted = foundUserUpvote ? true : false;
  const isDownvoted = foundUserDownvote ? true : false;

  const totalComments = await Comment.countDocuments({ postId });

  res
    .status(200)
    .send({ totalScore, isUpvoted, isDownvoted, postSaved, totalComments });
}
// );

const handleUpVote = 
// tryCatch(
  async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

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
    if (!upVoted) return new Error('Error up-voting the post') 
    // ApiError('Error up-voting the post', 1000, 1000);
  } else {
    const removedUpVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { upVotes: userId } },
      { new: true }
    );
    if (!removedUpVote)
      return new Error('Error up-voting the post')
    // ApiError('Error up-voting the post', 1000, 1000);
  }
  res.status(200).json({ message: 'upVoted' });
}
// );

const handleDownVote = 
// tryCatch(
  async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

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
    if (!downVoted) return new Error('Error up-voting the post') 
    // ApiError('Error up-voting the post', 1000, 1000);
  } else {
    const removedDownVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { downVotes: userId } },
      { new: true }
    );
    if (!removedDownVote)
      return new Error('Error up-voting the post')
    // ApiError('Error up-voting the post', 1000, 1000);
  }
  res.status(200).json({ message: 'downVoted' });
}
// );
// Save post

const savePost =
//  tryCatch(
  async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

  const savedPost = await User.findOne(
    { _id: userId, savedPosts: postId },
    { projection: { _id: 1 } }
  );

  if (savedPost?._id) {
    const removedPost = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { savedPosts: postId },
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .send({ message: 'post removed from bookmarked', code: '11' });
    return;
  } else {
    const savedPostToUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { savedPosts: postId },
      },
      {
        new: true,
      }
    );
    res.status(200).send({ message: 'post bookmarked', code: '22' });
    return;
  }
}
// );

const deletePost = 
// tryCatch(
  async (req: Request, res: Response) => {
  const { postId, userId } = req.body;
  const deletedPost = await Post.findOneAndDelete({ _id: postId });

  const removerFromSaved = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { savedPosts: postId },
    },
    {
      new: true,
    }
  );

  if (!deletePost && !removerFromSaved) {
    throw new Error('error deleting post') 
    // ApiError('error deleting post', 1000, 1000);
  }

  res.status(200).json({ message: 'Post Deleted Successfully!' });
}
// );

const postDetailsCommunityInfo =
//  tryCatch(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    // console.log(comId);
    const communityInfo = await Community.findById(communityId).select(
      'authorName avatar description name rules'
    );

    // console.log(communityInfo);
    res.status(200).send(communityInfo);
  }
// );

const getCommunityNumberOfPosts = 
// tryCatch(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const numberOfPosts = await Post.countDocuments({ communityId });
    res.status(200).json(numberOfPosts);
  }
// );

export {
  getNumberOfPosts,
  createPost,
  getAllCommunityPosts,
  getAllPosts,
  getDetailsPost,
  getPostStats,
  handleUpVote,
  handleDownVote,
  savePost,
  deletePost,
  postDetailsCommunityInfo,
  getCommunityNumberOfPosts,
};
