import { body, ValidationError, validationResult } from 'express-validator';
import { Request } from 'express-validator/lib/base.js';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validate = (req: Request, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { errors: ValidationError[]; }): any; new(): any; }; }; }, next: () => void) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
