import { NextFunction, Request, Response, Router } from 'express';
import {
  getCommunity,
  createCommunity,
  findCommunities,
  joinCommunity,
  getCommunities,
  leaveCommunity,
  editCommunity,
} from '../controllers/community.controllers';
import { check } from 'express-validator';
import multer, { FileFilterCallback } from 'multer';
import { verifyJwt } from '../middlewares/auth.middleware';
import { uploadEditPhotosValidation } from '../utility/express-validations';
import { tryCatch } from '../utility/tryCatch';

const router = Router();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.fieldname === 'avatarImg') {
    file.mimetype === 'avatarImg.jpg' || file.mimetype === 'avatarImg.png'
      ? cb(null, true)
      : cb(null, false);
  } else if (file.filename === 'coverImg') {
    file.mimetype === 'coverImg.jpg' || file.mimetype === 'coverImg.png'
      ? cb(null, true)
      : cb(null, false);
  }
};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     return cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const uploadEditPhotos = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

// console.log(uploadEditPhotos.single('avatarImg'));

router.post(
  '/editCommunity',
  uploadEditPhotos.single('avatarImg'),
  (req: Request, res: Response) => {
    console.log(req.file);
  }
);

// const upload = multer().single('avatarImg');

// router.post('/editCommunity', function (req, res) {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       console.log(err);
//     } else if (err) {
//       console.log(err);
//     }

//     // Everything went fine.
//   });
// });

router.post('/create', createCommunity);
router.get('/findCommunities/:pageCount', findCommunities);
router.get('/getCommunity/:name', getCommunity);
router.post('/joinCommunity', verifyJwt, joinCommunity);
router.post('/leaveCommunity', verifyJwt, leaveCommunity);
router.get('/getUserCommunitiesList', verifyJwt, getCommunities);
export default router;
