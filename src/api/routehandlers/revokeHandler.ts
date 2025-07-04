import { Request, Response } from 'express';
import { getBearerToken } from '../authentication/auth.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';
import { revokeRefreshToken } from '../../db/queries/refreshTokens.js';

export async function revokeHandler(req: Request, res: Response) {
  const token = await getBearerToken(req);

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  await revokeRefreshToken(token);

  return res.sendStatus(204);
}
