// User routes under /api/users
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.js';
import { validate } from '@/middlewares/validate.js';
import userController from './controller.js';
import Joi from 'joi';

export const basePath = '/api/users';
const router = Router();

const userCreateSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').optional(),
  }),
};

const userUpdateSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('user', 'admin').optional(),
  }).min(1),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() })
};

router.get('/', userController.getUsers);
router.post('/', validate(userCreateSchema), userController.createUser);
router.put('/:id', validate(userUpdateSchema), userController.updateUser);
router.delete('/:id', validate(idParamSchema), userController.removeUser);

export default router;
