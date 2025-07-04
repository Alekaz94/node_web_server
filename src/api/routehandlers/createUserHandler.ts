import { Request, Response } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { createUser } from '../../db/queries/users.js';
import { hashPassword } from '../authentication/auth.js';
import { JSONResponse } from '../jsonResponse.js';
import { NewUser } from '../../db/schema.js';

export type UserResponse = Omit<NewUser, 'hashedPassword'>;

export async function createUserHandler(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError('Missing required fields');
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error('Could not create user');
  }

  JSONResponse(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}
