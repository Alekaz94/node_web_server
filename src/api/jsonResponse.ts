import { Response } from 'express';

export function JSONResponseError(
  res: Response,
  code: number,
  message: string
) {
  JSONResponse(res, code, message);
}

export function JSONResponse(res: Response, code: number, payload: any) {
  res.header('Content-Type', 'application/json');
  const body = JSON.stringify(payload);
  res.status(code).send(body);
  res.end();
}
