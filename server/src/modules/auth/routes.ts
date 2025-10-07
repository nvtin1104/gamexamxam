// Auth routes under /api/auth
import { Router } from 'express';
import authController from './controller.js';
import { validate } from '@/middlewares/validate.js';
import Joi from 'joi';

export const basePath = '/api/auth';
const router = Router();

const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const refreshSchema = {
  body: Joi.object({ refreshToken: Joi.string().required() }),
};

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);

export default router;
