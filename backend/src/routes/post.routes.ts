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
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

router.get('/getAllPosts/:page', getAllPosts);
router.get('/numberOfPosts', getNumberOfPosts);
router.get('/postDetails/:postId', getDetailsPost);
router.get('/postStats/:postId/:userId', getPostStats);
router.get('/postDetailsCommunityInfo/:comId', postDetailsCommunityInfo);
router.get('/communityNumberOfPosts/:communityId', getCommunityNumberOfPosts);
router.get('/:communityId/:page', getAllCommunityPosts);
router.post('/upVote', handleUpVote);
router.post('/downVote', handleDownVote);
router.post('/savePost', savePost);
router.post('/deletePost', deletePost);
router.post(
  '/createPost',
  verifyJwt,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createPost
);
export default router;
