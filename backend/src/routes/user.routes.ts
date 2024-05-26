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

router.get('/', verifyJwt, getUserData);
router.get('/posts', verifyJwt, getUserProfilePosts);
router.get('/saved', verifyJwt, getUserProfileSaved);
router.get('/comments', verifyJwt, getUserProfileComments);
router.post('/editUser', verifyJwt, editUser);

export default router;
