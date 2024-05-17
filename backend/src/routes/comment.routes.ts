import { Router } from 'express';
import { create, getComments } from '../controllers/comment.controller';

const router = Router();

router.get('/getComments/:postId/:commentPage', getComments);
router.post('/create', create);

export default router;
