import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { ForbiddenError } from '../errorhandling/ForbiddenError.js';
import { NotFoundError } from '../errorhandling/NotFoundError.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';
import { JSONResponseError } from '../jsonResponse.js';

export const errorHandlingMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Something went wrong on our end';

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  JSONResponseError(res, statusCode, message);
};
