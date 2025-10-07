import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@/utils/apiError.js';

// Joi validation middleware factory
export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { body: req.body, params: req.params, query: req.query };
    const baseSchema = Joi.object({ body: Joi.any(), params: Joi.any(), query: Joi.any() });
    const mergedSchema = baseSchema.keys(schema);
    const { error, value } = mergedSchema.validate(data, { abortEarly: false, allowUnknown: true });
    
    if (error) {
      return next(new ApiError(400, error.details.map((d) => d.message).join(', ')));
    }
    
    req.body = value.body ?? req.body;
    req.params = value.params ?? req.params;
    req.query = value.query ?? req.query;
    return next();
  };
}

export default validate;
