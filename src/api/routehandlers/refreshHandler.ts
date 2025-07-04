import { Request, Response } from 'express';
import { getBearerToken, makeJWT } from '../authentication/auth.js';
import { getRefreshToken } from '../../db/queries/refreshTokens.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';
import { JSONResponse } from '../jsonResponse.js';
import { config } from '../../config.js';

export async function refreshHandler(req: Request, res: Response) {
  const token = await getBearerToken(req);

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  const existingToken = await getRefreshToken(token);
  const now = new Date();

  if (
    !existingToken ||
    existingToken.revokedAt !== null ||
    existingToken.expiresAt < now
  ) {
    throw new UnauthorizedError('User is unauthorized!');
  }

  const newAccessToken = await makeJWT(
    existingToken.userId,
    config.jwt.defaultDuration,
    config.jwt.secret
  );

  JSONResponse(res, 200, { token: newAccessToken });
}
