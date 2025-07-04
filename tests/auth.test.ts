import { describe, it, expect, beforeAll } from 'vitest';
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  validateJWT,
} from '../src/api/authentication/auth.js';
import { Request } from 'express';

describe('Password Hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;
  const secret = 'mysecret';
  const wrongSecret = 'notMySecret';
  const expiresIn = 1000;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it('should create a jwt', async () => {
    const token = await makeJWT('abcde', expiresIn, secret);
    expect(typeof token).toBe('string');

    const decoded = await validateJWT(token, secret);
    expect(decoded).toBe('abcde');
  });

  it('should check token is valid', async () => {
    const token = await makeJWT('abcde', expiresIn, secret);
    const valid = await validateJWT(token, secret);
    expect(valid).toBe('abcde');
  });

  it('should reject expired token', async () => {
    const expiredToken = await makeJWT('abcde', -1, secret);

    expect(() => validateJWT(expiredToken, wrongSecret)).toThrow;
  });

  it('should reject with wrong secret', async () => {
    const token = await makeJWT('abcde', expiresIn, secret);

    expect(() => validateJWT(token, wrongSecret)).toThrow;
  });

  it('should get token from header', async () => {
    const token = await makeJWT('abcde', expiresIn, secret);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const extractedToken = await getBearerToken(req);
    expect(extractedToken).toBe(token);
  });

  it('should throw an error if no auth header found', async () => {
    const req = {
      headers: {},
    } as Request;

    await expect(getBearerToken(req)).rejects.toThrow(
      'No Authorization header found'
    );
  });
});
