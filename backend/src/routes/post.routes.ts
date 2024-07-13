import { Router } from "express";
import {
  createPost,
  createRecentPost,
  deletePost,
  getAllCommunityPosts,
  getAllPosts,
  getCommunitiesFeedPosts,
  getCommunityNumberOfPosts,
  getDetailsPost,
  getNumberOfPosts,
  getPostStats,
  getRecentPost,
  handleDownVote,
  handleUpVote,
  postDetailsCommunityInfo,
  savePost,
} from "../controllers/post.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/getAllPosts/:page", getAllPosts);

router.get("/numberOfPosts", getNumberOfPosts);

router.get("/postDetails/:postId", getDetailsPost);

router.get("/postStats/:postId", getPostStats);

router.get("/postDetailsCommunityInfo/:communityId", postDetailsCommunityInfo);

router.get("/numberOfPosts/:communityId", getCommunityNumberOfPosts);

router.get("/communityPosts/:communityId/:page", getAllCommunityPosts);

router.get("/communities-feed-posts/:page", getCommunitiesFeedPosts);

router.get("/recent-post", getRecentPost);

router.post("/upVote", handleUpVote);

router.post("/downVote", handleDownVote);

router.post("/savePost", savePost);

router.post("/deletePost", deletePost);

router.post("/recent-post", createRecentPost);

router.post(
  "/createPost",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createPost
);

export default router;
