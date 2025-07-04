import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError';

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function validateJWT(tokenString: string, secret: string) {
  try {
    const decodedJwt = jwt.verify(tokenString, secret) as JwtPayload;

    if (!decodedJwt.sub || typeof decodedJwt.sub !== 'string') {
      throw new Error('Invalid token payload: missing subject');
    }

    return decodedJwt.sub;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

export async function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string
) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;

  const payload = {
    iss: 'chirpy',
    sub: userId,
    iat: issuedAt,
    exp: expiresAt,
  };

  return jwt.sign(payload, secret);
}

export async function getBearerToken(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('No Authorization header found');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Invalid Authorization header format');
  }

  return token;
}
