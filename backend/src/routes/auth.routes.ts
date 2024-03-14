import { Router } from 'express';
import { login, validateToken, logout } from '../controllers/auth.controllers';
import { check } from 'express-validator';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/sign-in',
  [
    check('username', 'This field is required as a string').isString(),
    check('password', 'This field should have 8 character or more')
      .isString()
      .isLength({
        min: 8,
      }),
  ],
  login
);

router.post('/logout', logout);

router.post('/validate-token', verifyToken, validateToken);

export default router;
