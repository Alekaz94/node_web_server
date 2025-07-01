import { Request, Response } from 'express';
import { BadRequestError } from '../errorhandling/BadRequestError.js';

export function validationHandler(req: Request, res: Response) {
  const chirp = req.body;
  const text = chirp.body;
  const bannedWords = ['kerfuffle', 'sharbert', 'fornax'];

  if (typeof chirp !== 'object' || typeof chirp.body !== 'string') {
    throw new BadRequestError('Something went wrong');
  }

  if (text.length >= 140) {
    throw new BadRequestError('Chirp is too long. Max length is 140');
  }

  const cleanedWords = text.split(' ').map((word: string) => {
    if (bannedWords.includes(word.toLowerCase())) {
      return '****';
    }
    return word;
  });

  const cleanedBody = cleanedWords.join(' ');

  res.status(200).json({
    cleanedBody,
  });
}
