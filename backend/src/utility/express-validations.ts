import { body, check } from 'express-validator';

export const signInValidations = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long')
    .isLowercase()
    .withMessage('Username must be lowercase'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const uploadEditPhotosValidation = [
  check('avatarImg')
    .custom((value, { req }) => {
      if (
        req.files.avatarImg &&
        req.files.avatarImg[0] &&
        (req.files.avatarImg[0].mimetype === 'image/jpeg' ||
          req.files.avatarImg[0].mimetype === 'image/png')
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Please upload a Avatar Image in jpg or png format'),
  check('coverImg')
    .custom((value, { req }) => {
      if (
        req.files.coverImg &&
        req.files.coverImg[0] &&
        (req.files.coverImg[0].mimetype === 'image/jpeg' ||
          req.files.coverImg[0].mimetype === 'image/png')
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Please upload a Cover Image in jpg or png format'),
];
