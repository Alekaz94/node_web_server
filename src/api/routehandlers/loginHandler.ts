import { Request, Response } from 'express';
import { getUserByEmail } from '../../db/queries/users.js';
import { checkPasswordHash } from '../authentication/auth.js';
import { JSONResponse, JSONResponseError } from '../jsonResponse.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';

export async function loginHandler(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  const user = await getUserByEmail(params.email);

  if (!user) {
    throw new UnauthorizedError('invalid username or password');
  }

  const isValidPassword = await checkPasswordHash(
    params.password,
    user.hashedPassword
  );

  if (!isValidPassword) {
    throw new UnauthorizedError('invalid username or password');
  }

  JSONResponse(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
