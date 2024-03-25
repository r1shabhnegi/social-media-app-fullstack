import { Router } from 'express';
import { signIn, signOut } from '../controllers/auth.controllers';
import { body } from 'express-validator';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

export default router;
