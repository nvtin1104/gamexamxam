import { Request, Response, NextFunction } from 'express';

// Wrap async route handlers to forward errors to the global error handler
export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
