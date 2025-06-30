import { Request, Response } from 'express';

export function validationHandler(req: Request, res: Response) {
  const chirp = req.body;
  const text = chirp.body;
  const bannedWords = ['kerfuffle', 'sharbert', 'fornax'];

  if (typeof chirp !== 'object' || typeof chirp.body !== 'string') {
    throw new Error('Something went wrong');
  }

  if (text.length >= 140) {
    throw new Error('Chirp is too long');
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
