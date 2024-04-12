import { Request, Response, Router } from 'express';
import {
  getCommunity,
  createCommunity,
  findCommunities,
  joinCommunity,
  getCommunities,
  leaveCommunity,
  editCommunity,
} from '../controllers/community.controllers';
import { check } from 'express-validator';
import multer, { FileFilterCallback } from 'multer';
import { verifyJwt } from '../middlewares/auth.middleware';
import { uploadEditPhotosValidation } from '../utility/express-validations';
import { tryCatch } from '../utility/tryCatch';

const router = Router();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.fieldname === 'avatarImg') {
    file.mimetype === 'avatarImg.jpg' || file.mimetype === 'avatarImg.png'
      ? cb(null, true)
      : cb(null, false);
  } else if (file.filename === 'coverImg') {
    file.mimetype === 'coverImg.jpg' || file.mimetype === 'coverImg.png'
      ? cb(null, true)
      : cb(null, false);
  }
};

const storage = multer.memoryStorage();
const uploadEditPhotos = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
}).fields([
  { name: 'avatarImg', maxCount: 1 },
  { name: 'coverImg', maxCount: 1 },
]);

router.post('/editCommunity', uploadEditPhotos, editCommunity);

router.post('/create', createCommunity);
router.get('/findCommunities/:pageCount', findCommunities);
router.get('/getCommunity/:name', getCommunity);
router.post('/joinCommunity', verifyJwt, joinCommunity);
router.post('/leaveCommunity', verifyJwt, leaveCommunity);
router.get('/getUserCommunitiesList', verifyJwt, getCommunities);
export default router;
