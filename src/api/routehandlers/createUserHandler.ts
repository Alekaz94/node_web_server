import { Request, Response } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { createUser } from '../../db/queries/users.js';

export async function createUserHandler(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Missing required fields');
  }

  if (typeof email !== 'string') {
    throw new BadRequestError('Error must be a string!');
  }

  const user = await createUser({ email });

  if (!user) {
    throw new Error('Could not create user');
  }

  return res.status(201).json(user);
}
