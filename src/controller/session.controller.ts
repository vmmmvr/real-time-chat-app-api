import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import log from '../logger/logger';
import { validatePassword } from '../service/helpers/validatePassword';
import { createAccesstoken, createSession, updateSession } from '../service/session.service';
import { Prisma } from '@prisma/client';
import { sign } from '../service/utils/jwt.utils';
import { info } from 'console';
import { get } from 'lodash';
import RequestWithUser from '../Interfaces/RequestWithUser';
import config from '../../config';
import requestIP from 'request-ip';

// login handler
export const createUserSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  // validate email & password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid Email or password');
  }

  const ipAddress = requestIP.getClientIp(req);

  // console.log({
  //   ipAddress
  // });

  // create a session
  const userAgent = req.get('user-agent') || '';
  const sessionInput = { user, ipAddress, userAgent, valid: true };
  const session = await createSession(sessionInput);

  // create acess token
  const accessToken = await createAccesstoken({ user, session });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.refreshTokenTtl,
  });
  // creating a cookie
  res.cookie('accessToken', accessToken, {
    maxAge: 900000, // 15 min
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: false,
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: false,
  });
  // returning the access & the refresh tokens
  return res.send({ accessToken, refreshToken });
};

export const getUserSessionHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    return res.send(res.locals.user);
  } catch (error: any) {
    log.error(error.message);

    return res.status(401).send(error.message);
  }
};
// logout handler
export const invalidateUserSessionHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const sessionId = get(req, 'user.session');

  await updateSession(sessionId, false);

  return res.sendStatus(200);
};
