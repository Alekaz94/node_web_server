import { Request, Response } from 'express';
import { config } from '../../config.js';

export function resetMetricsHandler(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.status(200).type('text/plain').send('Hits counter reset to 0.');
}
