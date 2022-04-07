import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import RequestWithUser from "../Interfaces/RequestWithUser";
import log from "../logger/logger";

export default function requireUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const user = get(req, "user");
  if (!user) return res.status(403).send({ error: "un authorized" });
  res.locals.user = user;
  return next();
}
