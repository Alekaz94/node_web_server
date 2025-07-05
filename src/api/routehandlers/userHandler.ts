import { Request, Response } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { createUser, updateUser } from '../../db/queries/users.js';
import { getBearerToken, hashPassword, validateJWT } from '../authentication/auth.js';
import { JSONResponse } from '../jsonResponse.js';
import { NewUser } from '../../db/schema.js';
import { config } from '../../config.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';

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

export async function updateUserHandler(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError('Missing email or password to update!');
  }

  const token = await getBearerToken(req);

  if (!token) {
    throw new UnauthorizedError('Invalid or missing token!');
  }

  const userId = await validateJWT(token, config.jwt.secret);
  const hashedPassword = await hashPassword(params.password);

  const userToUpdate = await updateUser(userId, {
    email: params.email,
    hashedPassword: hashedPassword,
  } satisfies NewUser);

  if (!userToUpdate) {
    throw new BadRequestError('Could not update user!');
  }

  JSONResponse(res, 200, {
    id: userToUpdate.id,
    email: userToUpdate.email,
    createdAt: userToUpdate.createdAt,
    updatedAt: userToUpdate.updatedAt,
  } satisfies UserResponse);
}
