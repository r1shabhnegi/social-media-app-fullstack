import { Router } from 'express';
import {
  addUpVote,
  createPost,
  getAllPosts,
  getCommunityPosts,
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

router.get('/getAllPosts', getAllPosts);

router.get('/:id', getCommunityPosts);
router.get('/getPostStats/:postId', getPostStats);
router.post('/addUpVote', addUpVote);

export default router;
