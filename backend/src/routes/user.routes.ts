import express, { Request, Response } from 'express';
import { register } from '../controllers/user.controllers';

const router = express.Router();

// router.get('/register', async (req: Request, res: Response) => {
//   console.log('Called');
//   res.send({
//     message: 'Risbjgjvh',
//   });
// });
router.get('/register', register);

export default router;
