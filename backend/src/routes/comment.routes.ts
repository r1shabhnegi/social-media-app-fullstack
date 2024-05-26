import { Router } from 'express';
import { create, getComments } from '../controllers/comment.controller';

const router = Router();

router.post('/create', create);

router.get('/getComments/:postId/:commentPage', getComments);

export default router;
