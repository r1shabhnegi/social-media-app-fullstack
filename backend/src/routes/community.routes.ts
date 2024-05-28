import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware';

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

const router = Router();

router.get('/findCommunities/:page', findCommunities);

router.get('/getCommunity/:comId', getCommunity);

router.get('/getUserCommunitiesList', getCommunities);

router.get('/getUserModCommunities', getModCommunities);

router.post('/create', createCommunity);

router.post('/joinCommunity', joinCommunity);

router.post('/leaveCommunity', leaveCommunity);

router.post('/deleteCommunity', deleteCommunity);

router.patch(
  '/editCommunity',
  upload.fields([
    { name: 'avatarImg', maxCount: 1 },
    { name: 'coverImg', maxCount: 1 },
  ]),
  editCommunity
);
export default router;
