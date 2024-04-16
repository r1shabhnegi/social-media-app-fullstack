import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'upload/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });

// const uploadEditPhotos = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10,
//   },
// });

app.post(
  '/api/community/editCommunity',
  // uploadEditPhotos.single('avatarImg'),
  fileUpload({ createParentPath: true }),
  (req: Request, res: Response) => {
    console.log(req.files);
    console.log(req.body);
  }
);

app.listen(7500, () => {
  console.log('connected');
});
