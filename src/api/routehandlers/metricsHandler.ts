import { Request, Response } from 'express';
import { config } from '../../config.js';

export function metricsHandler(req: Request, res: Response) {
  const html = `
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
      </body>
    </html>
  `;
  res
    .status(200)
    .set('Content-Type')
    .type('text/html; charset=utf-8')
    .send(html);
}
