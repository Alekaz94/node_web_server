import express, { NextFunction, Request, Response } from 'express';
import { validationHandler } from './routehandlers/validationHandler.js';
import { handlerReadiness } from './routehandlers/handlerReadiness.js';
import { resetMetricsHandler } from './routehandlers/resetMetricsHandler.js';
import { metricsHandler } from "./routehandlers/metricsHandler.js"
import { config } from './config.js';

const app = express();
const PORT = 8080;

//Middleware setup
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.use(express.json());
app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/app`);
});

//Routes
app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', metricsHandler);
app.post('/admin/reset', resetMetricsHandler);
app.post('/api/validate_chirp', validationHandler);

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


