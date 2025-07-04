import { Request, Response } from 'express';
import { getUserByEmail } from '../../db/queries/users.js';
import {
  checkPasswordHash,
  makeJWT,
  makeRefreshToken,
} from '../authentication/auth.js';
import { JSONResponse } from '../jsonResponse.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';
import { config } from '../../config.js';
import { UserResponse } from './createUserHandler.js';
import { createRefreshToken } from '../../db/queries/refreshTokens.js';

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function loginHandler(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 60);

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

  const accessToken = await makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  );
  const hexString = await makeRefreshToken();

  const refTok = {
    token: hexString,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: user.id,
    expiresAt: expiresAt,
    revokedAt: null,
  };

  await createRefreshToken(refTok);

  JSONResponse(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: hexString,
  } satisfies LoginResponse);
}
