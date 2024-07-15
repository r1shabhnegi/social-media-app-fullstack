import { Response, Request } from "express";
import { Post } from "../models/post.model";
import { uploadOnCloudinary } from "../utility/cloudinary";
import { Community } from "../models/community.model";
import { ObjectId } from "mongodb";
import {
  POST_COMMUNITY_NOT_EXIST,
  POST_NOT_CREATED,
  POST_NOT_FOUND,
} from "../utility/errorConstants";
import User from "../models/user.model";
import { Comment } from "../models/comment.model";
import { redis } from "../utility/redis";

const getNumberOfPosts = async (req: Request, res: Response) => {
  try {
    const numberOfPosts = await Post.countDocuments();
    return res.status(200).send(numberOfPosts.toString());
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, communityName } = req.body;
    const image = req.files;
    const foundCommunity = await Community.findOne({ name: communityName });

    if (!foundCommunity)
      // throw new Error("community does not exist");
      return res.status(500).json({ error: "haven't left" });
    // throw new ApiError(
    //   "community does not exist",
    //   POST_COMMUNITY_NOT_EXIST,
    //   401
    // );

    const author = await User.findById(req.userId);

    await redis.del(`profilePosts:${author?.username}`);
    // console.log(author?.avatar);

    if (!author)
      // throw new Error("user does not exist");
      return res.status(500).json({ error: "user does not exist" });
    // throw new ApiError("user does not exist", POST_COMMUNITY_NOT_EXIST, 401);

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
    const imageFile = req.files as {
      [fieldName: string]: Express.Multer.File[];
    };

    const imagePath = imageFile.image[0].path;
    if (imagePath) {
      const url = await uploadOnCloudinary(imagePath);
      if (!url)
        // throw new Error("Error Uploading Image");
        return res.status(500).json({ error: "Error Uploading Image" });
      //   throw new ApiError("Error Uploading Image", 908, 403);
      // newPost.image = url;
    }

    await newPost.save();

    if (!newPost)
      // throw new Error("Error Uploading Image");
      return res.status(500).json({ error: "Error Uploading Image" });
    // throw new ApiError("Error Uploading Image", POST_NOT_CREATED, 401);

    return res.status(200).json({ message: "Post Created Successfully" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getAllCommunityPosts = async (req: Request, res: Response) => {
  try {
    const { page, communityId } = req.params;
    const skipPosts = +page * 5;
    const pageItems = 5;
    const foundPosts = await Post.find({
      communityId,
    })
      .skip(skipPosts)
      .limit(pageItems)
      .sort({ createdAt: -1 });

    if (!foundPosts)
      // throw new Error("Posts Not Found");
      return res.status(500).json({ error: "Posts Not Found" });
    // throw new ApiError("Posts Not Found", POST_NOT_FOUND, 404);

    return res.status(200).json(foundPosts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const skipPosts = +page * 5;
    const pageItems = 5;

    const foundPosts = await Post.find()
      .skip(skipPosts)
      .limit(pageItems)
      .sort({ createdAt: -1 });
    console.log(foundPosts);
    return res.status(200).send(foundPosts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getDetailsPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const foundPostDetail = await Post.findById(postId);
    // console.log(foundPostDetail);

    return res.status(200).send(foundPostDetail);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getPostStats = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const handleUpVote = async (req: Request, res: Response) => {
  try {
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
      if (!upVoted) return new Error("Error up-voting the post");
      // ApiError('Error up-voting the post', 1000, 1000);
    } else {
      const removedUpVote = await Post.findByIdAndUpdate(
        postId,
        { $pull: { upVotes: userId } },
        { new: true }
      );
      if (!removedUpVote)
        // throw new Error("Error up-voting the post");
        return res.status(500).json({ error: "Error up-voting the post" });
      // throw new ApiError("Error up-voting the post", 1000, 1000);
    }
    return res.status(200).json({ message: "upVoted" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
const handleDownVote = async (req: Request, res: Response) => {
  try {
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
      if (!downVoted)
        // throw new Error("Error up-voting the post");
        return res.status(500).json({ error: "Error up-voting the post" });
      // throw new ApiError("Error up-voting the post", 1000, 1000);
    } else {
      const removedDownVote = await Post.findByIdAndUpdate(
        postId,
        { $pull: { downVotes: userId } },
        { new: true }
      );
      if (!removedDownVote)
        // throw new Error("Error up-voting the post");
        return res.status(500).json({ error: "Error up-voting the post" });
      // throw new ApiError("Error up-voting the post", 1000, 1000);
    }
    return res.status(200).json({ message: "downVoted" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
// Save post

const savePost = async (req: Request, res: Response) => {
  try {
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
        .send({ message: "post removed from bookmarked", code: "11" });
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
      return res.status(200).send({ message: "post bookmarked", code: "22" });
      return;
    }
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
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
      // throw new Error("error deleting post");
      return res.status(500).json({ error: "Error up-voting the post" });
      // throw new ApiError("error deleting post", 1000, 1000);
    }

    return res.status(200).json({ message: "Post Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const postDetailsCommunityInfo = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    // console.log(comId);
    const communityInfo = await Community.findById(communityId).select(
      "authorName avatar description name rules"
    );

    // console.log(communityInfo);
    return res.status(200).send(communityInfo);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
const getCommunityNumberOfPosts = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const numberOfPosts = await Post.countDocuments({ communityId });
    return res.status(200).json(numberOfPosts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};
const createRecentPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const { postId } = req.body;
    console.log("userId=", userId);
    console.log("postId=", postId);

    const foundUser = await User.findById(userId).select("recentPosts");

    if (!foundUser) {
      throw new Error("something went wrong, creating recent post");
    }

    // const recentPostsArr = [postId, ...foundUser.recentPosts];
    const newArr = foundUser.recentPosts.filter(
      (e) => !e.equals(new ObjectId(`${postId}`))
    );

    const recentPostsArr = [new ObjectId(`${postId}`), ...newArr].slice(0, 5);

    console.log(recentPostsArr);
    foundUser.recentPosts = recentPostsArr;
    await foundUser.save();

    return res.status(200).send({ message: "done" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getRecentPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const foundPosts = await User.findById(userId).select("recentPosts");

    if (!foundPosts) {
      throw new Error("Error getting recent postsIds");
    }

    const postsArr = [];

    for (const postId of foundPosts?.recentPosts) {
      try {
        const post = await Post.findById(postId);
        if (post) postsArr.push(post);
      } catch (error) {
        throw new Error("error getting recent post");
      }
    }
    return res.status(200).send(postsArr);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getCommunitiesFeedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { page } = req.params;
    console.log("userId", userId);
    console.log("page", page);
    const pageSize = 5;

    const allCommunities = await Community.find({
      members: userId,
    }).select("_id");

    console.log("allCommunities", allCommunities);

    const posts = await Post.find({
      communityId: { $in: allCommunities.map((c) => c._id) },
    })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * pageSize)
      .limit(pageSize);
    console.log("postscFeed", posts);
    const numberOfPosts = await Post.countDocuments({
      communityId: { $in: allCommunities.map((c) => c._id) },
    });
    console.log("numberOfPosts", numberOfPosts);

    return res.status(200).send({ posts, numberOfPosts });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

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
  createRecentPost,
  getRecentPost,
  getCommunitiesFeedPosts,
};
