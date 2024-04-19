import { Router } from 'express';
import { createPost } from '../controllers/post.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.post(
  '/createPost',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createPost
);

export default router;
