import express, { NextFunction, Request, Response } from 'express';
import { validationHandler } from './routehandlers/validationHandler.js';
import { handlerReadiness } from './routehandlers/handlerReadiness.js';
import { resetMetricsHandler } from './routehandlers/resetMetricsHandler.js';
import { metricsHandler } from './routehandlers/metricsHandler.js';
import { middlewareLogResponses } from './middleware/middlewareLogResponses.js';
import { middlewareMetricsInc } from './middleware/middlewareMetricsInc.js';

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
app.post(
  '/api/validate_chirp',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validationHandler(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.use(errorHandlingMiddleware);

function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  res.status(500).json({ error: 'Something went wrong on our end' });
}
