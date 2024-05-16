import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllCommunityPosts,
  getAllPosts,
  getDetailPost,
  getNumberOfPosts,
  getPostStats,
  handleDownVote,
  handleUpVote,
  savePost,
} from '../controllers/post.controller';
import { upload } from '../middlewares/multer.middleware';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/createPost',
  verifyJwt,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createPost
);

router.get('/getAllPosts/:page', getAllPosts);
router.get('/:id/:page', getAllCommunityPosts);
router.get('/numberOfPosts', getNumberOfPosts);
router.get('/detail/:id', getDetailPost);
router.get('/postStats/:postId/:userId', getPostStats);
router.post('/upVote', handleUpVote);
router.post('/downVote', handleDownVote);
router.post('/savePost', savePost);
router.post('/deletePost', deletePost);

export default router;
