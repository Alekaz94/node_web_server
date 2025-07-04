import { Request, Response } from 'express';
import { JSONResponse, JSONResponseError } from '../jsonResponse.js';
import { getAllChirps, getChirpById } from '../../db/queries/chirps.js';

export async function getAllChirpsHandler(req: Request, res: Response) {
  const chirps = await getAllChirps();

  JSONResponse(res, 200, chirps);
}

export async function getChirpsByIdHandler(req: Request, res: Response) {
  const chirpId = req.params.chirpID;

  if (!chirpId) {
    JSONResponseError(res, 400, 'ChirpId not found');
  }

  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    JSONResponseError(res, 403, 'Chirp not found');
  }

  return JSONResponse(res, 200, chirp);
}
