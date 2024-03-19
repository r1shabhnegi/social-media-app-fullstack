import { Router } from 'express';
import { refreshToken } from '../controllers/refresh.controller';

const router = Router();

router.get('/', refreshToken);

export default router;
