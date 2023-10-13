import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import RequestWithUser from '../Interfaces/RequestWithUser';
import log from '../logger/logger';
import { reIssueAccessToken } from '../service/session.service';
import { decode } from '../service/utils/jwt.utils';

const deserializeUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // get the access token from headers
  const accessToken = get(req, 'cookies.accessToken') || get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  // get the refresh token from the header
  const refreshToken = get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh');

  if (!accessToken) return next();

  // check if access token is expired
  const { decoded, expired } = decode(accessToken);
  // attach the user to the request object
  if (decoded) {
    req.user = decoded as string;

    return next();
  }

  // reIssue access token
  if (expired && refreshToken) {
    const newAcessToken = await reIssueAccessToken({ refreshToken });

    if (newAcessToken) {
      // attaching the new access token to the cookies
      res.cookie('accessToken', newAcessToken, {
        maxAge: 900000, // 15 min
        httpOnly: false,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: false,
      });

      // attaching the new access token to res header
      res.setHeader('x-access-token', newAcessToken);
      // ataching user to req object
      const { decoded } = decode(newAcessToken);

      req.user = decoded as string;
    }

    return next();
  }

  return next();
};

export default deserializeUser;
