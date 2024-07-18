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

router.get("/get-all-posts/:page", getAllPosts);

router.get("/number-of-posts", getNumberOfPosts);

router.get("/post-details/:postId", getDetailsPost);

router.get("/post-stats/:postId", getPostStats);

router.get(
  "/post-details-community-info/:communityId",
  postDetailsCommunityInfo
);

router.get("/number-of-posts/:communityId", getCommunityNumberOfPosts);

router.get("/community-posts/:communityId/:page", getAllCommunityPosts);

router.get("/communities-feed-posts/:page", getCommunitiesFeedPosts);

router.get("/recent-post", getRecentPost);

router.post("/up-vote", handleUpVote);

router.post("/down-vote", handleDownVote);

router.post("/save-post", savePost);

router.post("/delete-post", deletePost);

router.post("/recent-post", createRecentPost);

router.post(
  "/create-post",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createPost
);

export default router;
