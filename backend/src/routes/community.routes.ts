import { Router } from 'express';

import {
  getCommunity,
  createCommunity,
  findCommunities,
  joinCommunity,
  getCommunities,
  leaveCommunity,
  editCommunity,
  getModCommunities,
  deleteCommunity,
} from '../controllers/community.controllers';
import { verifyJwt } from '../middlewares/auth.middleware';
// import { uploadEditPhotosValidation } from '../utility/express-validations';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.post(
  '/editCommunity',
  upload.fields([
    { name: 'avatarImg', maxCount: 1 },
    { name: 'coverImg', maxCount: 1 },
  ]),
  verifyJwt,
  editCommunity
);

router.post('/create', verifyJwt, createCommunity);
router.get('/findCommunities/:pageCount', findCommunities);
router.get('/getCommunity/:name', getCommunity);
router.post('/joinCommunity', verifyJwt, joinCommunity);
router.post('/leaveCommunity', verifyJwt, leaveCommunity);
router.get('/getUserCommunitiesList', verifyJwt, getCommunities);
router.get('/getUserModCommunities', verifyJwt, getModCommunities);
router.post('/deleteCommunity', verifyJwt, deleteCommunity);

export default router;
