import { body } from 'express-validator';

export const loginValidations = [
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
