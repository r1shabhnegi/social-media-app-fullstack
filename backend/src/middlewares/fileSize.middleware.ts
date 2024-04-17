const MB = 5;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;
  const filesOverLimit = [];
};
