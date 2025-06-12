import express, { NextFunction, Request, Response } from 'express';
import { config } from './config.js';

const app = express();
const PORT = 8080;

app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/healthz', handlerReadiness);
app.get('/metrics', metricsHandler);
app.get('/reset', resetMetricsHandler);

function handlerReadiness(req: Request, res: Response) {
  res.status(200).set('Content-Type', 'text/plain; charset=utf-8').send('OK');
}

function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });
  next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits++;
  next();
}

function metricsHandler(req: Request, res: Response) {
  res.type('text/plain').send(`Hits: ${config.fileserverHits}`);
}

function resetMetricsHandler(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.type('text/plain').send('Hits counter reset to 0.');
}
