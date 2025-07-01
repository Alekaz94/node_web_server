import express, { NextFunction, Request, Response } from 'express';
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { validationHandler } from './api/routehandlers/validationHandler.js';
import { handlerReadiness } from './api/routehandlers/handlerReadiness.js';
import { resetMetricsHandler } from './api/routehandlers/resetMetricsHandler.js';
import { metricsHandler } from './api/routehandlers/metricsHandler.js';
import { middlewareLogResponses } from './api/middleware/middlewareLogResponses.js';
import { middlewareMetricsInc } from './api/middleware/middlewareMetricsInc.js';
import { errorHandlingMiddleware } from './api/middleware/errorHandlingMiddleware.js';
import { config } from "./config.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

//Middleware setup
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.use(express.json());
app.use(middlewareLogResponses);

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

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}/app`);
});
