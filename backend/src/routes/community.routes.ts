import { Router } from 'express';
import {
  getCommunity,
  createCommunity,
  findCommunities,
  joinCommunity,
  getCommunities,
  leaveCommunity,
} from '../controllers/community.controllers';
import { check } from 'express-validator';
import multer from 'multer';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
// });

// [check('name', 'This field is required').isString()],
// upload.array('imageUrls'),
router.post('/create', createCommunity);
router.get('/findCommunities/:pageCount', findCommunities);
router.get('/getCommunity/:name', getCommunity);
router.post('/joinCommunity', verifyJwt, joinCommunity);
router.post('/leaveCommunity', verifyJwt, leaveCommunity);
router.get('/getUserCommunitiesList', verifyJwt, getCommunities);
export default router;
