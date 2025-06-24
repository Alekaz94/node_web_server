import { Request, Response } from 'express';

export function validationHandler(req: Request, res: Response) {
  try {
    const chirp = req.body;
    const text = chirp.body;
    const bannedWords = ['kerfuffle', 'sharbert', 'fornax'];

    if (typeof chirp !== 'object' || typeof chirp.body !== 'string') {
      res.status(400).json({
        error: 'Something went wrong',
      });
      return;
    }

    if (text.length >= 140) {
      res.status(400).json({
        error: 'Chirp is too long',
      });
      return;
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
  } catch (error) {
    res.status(400).json({
      error: 'Something went wrong',
    });
  }
}
