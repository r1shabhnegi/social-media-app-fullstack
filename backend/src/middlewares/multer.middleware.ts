import multer from "multer";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

const storage = multer.memoryStorage();

const maxSize = 5 * 1024 * 1024;

export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
});
