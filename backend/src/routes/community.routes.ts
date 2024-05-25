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
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.post(
  '/editCommunity',
  upload.fields([
    { name: 'avatarImg', maxCount: 1 },
    { name: 'coverImg', maxCount: 1 },
  ]),
  editCommunity
);

router.post('/create', createCommunity);
router.get('/findCommunities/:pageCount', findCommunities);
router.get('/getCommunity/:name', getCommunity);
router.post('/joinCommunity', joinCommunity);
router.post('/leaveCommunity', leaveCommunity);
router.get('/getUserCommunitiesList', getCommunities);
router.get('/getUserModCommunities', getModCommunities);
router.post('/deleteCommunity', deleteCommunity);

export default router;
