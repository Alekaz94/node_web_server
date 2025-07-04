import express from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { handlerReadiness } from './api/routehandlers/handlerReadiness.js';
import { metricsHandler } from './api/routehandlers/metricsHandler.js';
import { middlewareLogResponses } from './api/middleware/middlewareLogResponses.js';
import { middlewareMetricsInc } from './api/middleware/middlewareMetricsInc.js';
import { errorHandlingMiddleware } from './api/middleware/errorHandlingMiddleware.js';
import { config } from './config.js';
import { createUserHandler } from './api/routehandlers/createUserHandler.js';
import { resetMetricsHandler } from './api/routehandlers/resetMetricsHandler.js';
import { createChirpHandler } from './api/routehandlers/createChirpHandler.js';
import {
  getAllChirpsHandler,
  getChirpsByIdHandler,
} from './api/routehandlers/getChirpsHandler.js';
import { loginHandler } from './api/routehandlers/loginHandler.js';
import { refreshHandler } from './api/routehandlers/refreshHandler.js';
import { revokeHandler } from './api/routehandlers/revokeHandler.js';

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

//Middleware setup
app.use(middlewareLogResponses);
app.use(express.json());

app.use('/app', middlewareMetricsInc, express.static('./src/app'));

//Routes
app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', metricsHandler);
app.post('/admin/reset', resetMetricsHandler);
app.post('/api/users', (req, res, next) => {
  Promise.resolve(createUserHandler(req, res)).catch(next);
});

app.post('/api/chirps', (req, res, next) => {
  Promise.resolve(createChirpHandler(req, res)).catch(next);
});
app.get('/api/chirps', (req, res, next) => {
  Promise.resolve(getAllChirpsHandler(req, res)).catch(next);
});
app.get(`/api/chirps/:chirpID`, (req, res, next) => {
  Promise.resolve(getChirpsByIdHandler(req, res)).catch(next);
});
app.post('/api/login', (req, res, next) => {
  Promise.resolve(loginHandler(req, res)).catch(next);
});
app.post('/api/refresh', (req, res, next) => {
  Promise.resolve(refreshHandler(req, res)).catch(next);
});
app.post('/api/revoke', (req, res, next) => {
  Promise.resolve(revokeHandler(req, res)).catch(next);
});

app.use(errorHandlingMiddleware);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}/app`);
});
