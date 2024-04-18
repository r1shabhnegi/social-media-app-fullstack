import { NextFunction, Request, Response, Router } from 'express';

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
// import multer, { FileFilterCallback } from 'multer';
import { verifyJwt } from '../middlewares/auth.middleware';
import { uploadEditPhotosValidation } from '../utility/express-validations';
import { tryCatch } from '../utility/tryCatch';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import multer from 'multer';
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
export default router;
