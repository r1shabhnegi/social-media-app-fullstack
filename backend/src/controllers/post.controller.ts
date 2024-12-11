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
    const foundCommunity = await Community.findOne({ name: communityName });

    if (!foundCommunity)
      return res.status(500).json({ error: "community not found" });
    // throw new Error("community does not exist");
    // throw new ApiError(
    //   "community does not exist",
    //   POST_COMMUNITY_NOT_EXIST,
    //   401
    // );

    const author = await User.findById(req.userId);

    if (!author) return res.status(500).json({ error: "user does not exist" });
    // throw new Error("user does not exist");
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

    // const imagePath = imageFile.image[0].path;

    if (imageFile) {
      const url = await uploadOnCloudinary(imageFile.image[0]);
      if (!url) return res.status(500).json({ error: "Error Uploading Image" });
      newPost.image = url;
    }

    await newPost.save();

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
    return res.status(200).send(foundPosts);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getDetailsPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const foundPostDetail = await Post.findById(postId);

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

    // Check if user has downvoted this post before
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

    // Check if user has already upvoted this post
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
      // User hasn't upvoted, add upvote
      const upVoted = await Post.findByIdAndUpdate(
        postId,
        {
          upVotes: [userId], // This overwrites all upvotes with just userId, which is probably not intended
          // $addToSet: { upVotes: userId }, // Better to use this if you want to add to an array without duplicates
        },
        {
          new: true,
        }
      );

      if (!upVoted) return new Error("Error up-voting the post"); // This won't send a response, it just creates an error object
      return res.status(200).json({ message: "upVoted" });
    }

    // User has upvoted, so remove the upvote
    const removedUpVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { upVotes: userId } },
      { new: true }
    );

    if (!removedUpVote) {
      return res.status(500).json({ error: "Error up-voting the post" });
    }

    return res.status(200).json({ message: "upVoted" });
  } catch (error: any) {
    return res.status(500).json(`${error.message || "Something went wrong"} `);
  }
};

const handleDownVote = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.body;

    // Check if user has upvoted this post before
    const foundUpVote = await Post.findOne(
      { _id: postId, upVotes: userId },
      { projection: { _id: 1 } }
    );

    if (foundUpVote) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { upVotes: userId } },
        { new: true }
      );
    }

    // Check if user has downvoted this post before
    const foundDownvoteInPost = await Post.findOne(
      { _id: postId, downVotes: userId },
      { projection: { _id: 1 } }
    );

    if (!foundDownvoteInPost) {
      // Add downvote if not present
      const downVoted = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { downVotes: userId } },
        { new: true }
      );
      if (!downVoted) {
        return res.status(500).json({ error: "Error down-voting the post" });
      }
      return res.status(200).json({ message: "Downvote processed" });
    }

    // If downvote exists, remove it
    const removedDownVote = await Post.findByIdAndUpdate(
      postId,
      { $pull: { downVotes: userId } },
      { new: true }
    );

    if (!removedDownVote) {
      return res.status(500).json({ error: "Error down-voting the post" });
    }

    return res.status(200).json({ message: "Downvote processed" });
  } catch (error: any) {
    console.error("Downvote error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
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
    const communityInfo = await Community.findById(communityId).select(
      "authorName avatar description name rules"
    );

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

    const foundUser = await User.findById(userId).select("recentPosts");

    if (!foundUser) {
      throw new Error("something went wrong, creating recent post");
    }

    // const recentPostsArr = [postId, ...foundUser.recentPosts];
    const newArr = foundUser.recentPosts.filter(
      (e) => !e.equals(new ObjectId(`${postId}`))
    );

    const recentPostsArr = [new ObjectId(`${postId}`), ...newArr].slice(0, 5);

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

    const pageSize = 5;

    const allCommunities = await Community.find({
      members: userId,
    }).select("_id");

    const posts = await Post.find({
      communityId: { $in: allCommunities.map((c) => c._id) },
    })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * pageSize)
      .limit(pageSize);
    const numberOfPosts = await Post.countDocuments({
      communityId: { $in: allCommunities.map((c) => c._id) },
    });

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
