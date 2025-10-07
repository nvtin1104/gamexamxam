// Classes routes under /api/classes
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.js';
import { validate } from '@/middlewares/validate.js';
import classesController from './controller.js';
import Joi from 'joi';

export const basePath = '/api/classes';
const router = Router();

// Validation schemas
const createSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
  }),
};

const updateSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
  }).min(1),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() })
};

// Routes
router.get('/', authMiddleware, classesController.getClassess);
router.get('/:id', authMiddleware, validate(idParamSchema), classesController.getClassesById);
router.post('/', authMiddleware, validate(createSchema), classesController.createClasses);
router.put('/:id', authMiddleware, validate(updateSchema), classesController.updateClasses);
router.delete('/:id', authMiddleware, validate(idParamSchema), classesController.removeClasses);

export default router;
