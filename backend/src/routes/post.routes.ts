import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllCommunityPosts,
  getAllPosts,
  getCommunityNumberOfPosts,
  getDetailsPost,
  getNumberOfPosts,
  getPostStats,
  handleDownVote,
  handleUpVote,
  postDetailsCommunityInfo,
  savePost,
} from '../controllers/post.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.get('/getAllPosts/:page', getAllPosts);

router.get('/numberOfPosts', getNumberOfPosts);

router.get('/postDetails/:postId', getDetailsPost);

router.get('/postStats/:postId', getPostStats);

router.get('/postDetailsCommunityInfo/:communityId', postDetailsCommunityInfo);

router.get('/numberOfPosts/:communityId', getCommunityNumberOfPosts);

router.get('/communityPosts/:communityId/:page', getAllCommunityPosts);

router.post('/upVote', handleUpVote);

router.post('/downVote', handleDownVote);

router.post('/savePost', savePost);

router.post('/deletePost', deletePost);

router.post(
  '/createPost',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createPost
);

export default router;
