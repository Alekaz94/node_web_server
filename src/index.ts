import express, { NextFunction, Request, Response } from 'express';

const app = express();
const PORT = 8080;

app.use('/app', express.static('./src/app'));
app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/healthz', handlerReadiness);

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
