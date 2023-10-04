import { NextFunction, Response } from 'express';
import RequestWithUser from '../Interfaces/RequestWithUser';

export const ipThrottler = async function (req: RequestWithUser, res: Response, next: NextFunction) {
  console.log({
    admin: res['admin'],
  });
  return next();
};
