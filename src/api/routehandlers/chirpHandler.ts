import { Request, Response } from 'express';
import { JSONResponse } from '../jsonResponse.js';
import {
  createChirp,
  deleteChirpById,
  getAllChirps,
  getChirpById,
} from '../../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../authentication/auth.js';
import { UnauthorizedError } from '../errorhandling/UnauthorizedError.js';
import { config } from '../../config.js';
import { ForbiddenError } from '../errorhandling/ForbiddenError.js';
import { NotFoundError } from '../errorhandling/NotFoundError.js';
import { BadRequestError } from '../errorhandling/BadRequestError.js';

export async function getAllChirpsHandler(req: Request, res: Response) {
  const chirps = await getAllChirps();

  JSONResponse(res, 200, chirps);
}

export async function getChirpsByIdHandler(req: Request, res: Response) {
  const chirpId = req.params.chirpID;

  if (!chirpId) {
    throw new NotFoundError('ChirpId not found!');
  }

  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    throw new NotFoundError('Chirp not found!');
  }

  return JSONResponse(res, 200, chirp);
}

export async function deleteChirpByIdHandler(req: Request, res: Response) {
  const chirpId = req.params.chirpID;
  if (!chirpId) {
    throw new NotFoundError('ChirpId not found!');
  }

  const token = await getBearerToken(req);
  if (!token) {
    throw new UnauthorizedError('Invalid or missing token!');
  }

  const chirpToDelete = await getChirpById(chirpId);
  const userId = await validateJWT(token, config.jwt.secret);
  if (!chirpToDelete) {
    throw new NotFoundError('Chirp not found!');
  }
  if (chirpToDelete.userId !== userId) {
    throw new ForbiddenError('You can not remove another users chirp!');
  }

  await deleteChirpById(chirpId);

  return res.sendStatus(204);
}

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
