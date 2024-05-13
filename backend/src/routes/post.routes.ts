import { Router } from 'express';
import {
  addUpVote,
  createPost,
  getAllPosts,
  getAllCommunityPosts,
  getDetailPost,
  getPostStats,
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

router.get('/:id', getAllCommunityPosts);
router.get('/getPostStats/:postId', getPostStats);
router.post('/addUpVote', addUpVote);
router.get('/detail/:id', getDetailPost);

export default router;
