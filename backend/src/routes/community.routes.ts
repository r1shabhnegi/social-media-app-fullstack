import { Router } from 'express';
import { createCommunity } from '../controllers/community.controllers';
import { check } from 'express-validator';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.post(
  '/create',
  [check('name', 'This field is required').isString()],
  upload.array('imageUrls'),
  createCommunity
);

export default router;
