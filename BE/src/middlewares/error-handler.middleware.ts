import { Request, Response, NextFunction } from 'express';
import {HTTPError, InternalServerError} from '../types/http-error.type'

/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err && err.message && err.message.includes("cannot be earlier than")) {
    return res.status(400).json({ error: 'Delivery date cannot be earlier than the shipping date.' });
  }

  const returnError = err instanceof HTTPError ? err : new InternalServerError();
  return res.status(returnError.getStatusCode()).send({ error: returnError.message });
};

export { errorHandler };