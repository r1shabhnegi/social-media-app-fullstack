import { Router } from 'express';
import { register } from '../controllers/user.controllers';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    check('name', 'This field is required as a string').isString(),
    check('username', 'This field is required as a string').isString(),
    check('email', 'This field is required as a string').isEmail(),
    check('password', 'This field should have 8 character or more').isLength({
      min: 8,
    }),
  ],
  register
);

export default router;
