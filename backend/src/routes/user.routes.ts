import { Router } from 'express';
import {
  editUser,
  getUserData,
  getUserProfileComments,
  getUserProfilePosts,
  getUserProfileSaved,
  signUp,
} from '../controllers/user.controllers';
import { body, check } from 'express-validator';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

router.post('/sign-up', signUp);
router.post('/editUser', verifyJwt, editUser);
router.get('/:username', verifyJwt, getUserData);
router.get('/:username/posts', verifyJwt, getUserProfilePosts);
router.get('/:username/saved', verifyJwt, getUserProfileSaved);
router.get('/:username/comments', verifyJwt, getUserProfileComments);

export default router;
