import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import log from "../logger/logger";
import { validatePassword } from "../service/helpers/validatePassword";
import {
  createAccesstoken,
  createSession,
  updateSession,
} from "../service/session.service";
import { Prisma } from "@prisma/client";
import config from "config";
import { sign } from "../service/utils/jwt.utils";
import { info } from "console";
import { get } from "lodash";
import RequestWithUser from "../Interfaces/RequestWithUser";

// login handler
export const createUserSessionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validate email & password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid Email or password");
  }

  // create a session
  const userAgent = req.get("user-agent") || "";
  const sessionInput = { user, userAgent, valid: true };
  const session = await createSession(sessionInput);

  // create acess token
  const accessToken = await createAccesstoken({ user, session });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"),
  });

  // returning the access & the refresh tokens
  return res.send({ accessToken, refreshToken });
};

// logout handler
export const invalidateUserSessionHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const sessionId = get(req, "user.session");

  await updateSession(sessionId, false);

  return res.sendStatus(200);
};
