import { Router } from 'express';
import { refreshToken, signIn, signOut } from '../controllers/auth.controllers';

const router = Router();

router.get('/refresh', refreshToken);

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

export default router;
