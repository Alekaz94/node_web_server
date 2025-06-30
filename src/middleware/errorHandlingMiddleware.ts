import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { ForbiddenError } from '../errorhandling/ForbiddenError.js';
import { NotFoundError } from '../errorhandling/NotFoundError.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';

export const errorHandlingMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof BadRequestError) {
    console.log(err);
    res.status(400).send({ error: err.message });
    return;
  } else if (err instanceof UnauthorizedError) {
    console.log(err);
    res.status(401).json({ error: err.message });
    return;
  } else if (err instanceof ForbiddenError) {
    console.log(err);
    res.status(403).send({ error: err.message });
    return;
  } else if (err instanceof NotFoundError) {
    console.log(err);
    res.status(404).send({ error: err.message });
    return;
  }

  console.log(err);
  res.status(500).json({ error: 'Something went wrong on our end' });
};
