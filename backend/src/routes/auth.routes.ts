import { Router } from 'express';
import { login, logout } from '../controllers/auth.controllers';
import { body } from 'express-validator';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/login',
  // verifyJwt,

  login
);

router.get('/logout', logout);

export default router;
