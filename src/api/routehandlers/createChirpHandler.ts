import { Request, Response } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';
import { createChirp } from '../../db/queries/chirps.js';
import { JSONResponse } from '../jsonResponse.js';
import { getBearerToken, validateJWT } from '../authentication/auth.js';
import { config } from '../../config.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';

export async function createChirpHandler(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  const params: parameters = req.body;

  const token = await getBearerToken(req);

  if (!token) {
    throw new UnauthorizedError('Missing or invalid bearer token.');
  }

  const userId = await validateJWT(token, config.jwt.secret);

  if (!userId) {
    throw new UnauthorizedError('Missing or invalid bearer token.');
  }

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({ body: cleaned, userId: userId });

  JSONResponse(res, 201, chirp);
}

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const badWords = ['kerfuffle', 'sharbert', 'fornax'];
  return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredCaseWord = word.toLowerCase();
    if (badWords.includes(loweredCaseWord)) {
      words[i] = '****';
    }
  }

  const cleaned = words.join(' ');
  return cleaned;
}
