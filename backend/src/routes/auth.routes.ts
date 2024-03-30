import { Router } from 'express';
import { signIn, signOut } from '../controllers/auth.controllers';
import { body } from 'express-validator';
import { verifyJwt } from '../middlewares/auth.middleware';
import { signInValidations } from '../utility/express-validations';

const router = Router();

router.post('/sign-in', signInValidations, signIn);

router.post('/sign-out', signOut);

export default router;
