import { Router } from 'express';
import {
  getUserData,
  getUserProfilePosts,
  getUserProfileSaved,
  signUp,
} from '../controllers/user.controllers';
import { body, check } from 'express-validator';

const router = Router();

router.post(
  '/sign-up',
  [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string'),
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 4 })
      .withMessage('Username must be at least 4 characters long')
      .isLowercase()
      .withMessage('Username must be lowercase'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Field must be a Email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  signUp
);

router.get('/:username', getUserData);
router.get('/:username/posts', getUserProfilePosts);
router.get('/:username/saved', getUserProfileSaved);

export default router;
