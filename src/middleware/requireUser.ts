import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import RequestWithUser from "../Interfaces/RequestWithUser";

export default function requireUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const user = get(req, "user");

  if (!user) return res.status(403).send({ error: "un authorized" });

  return next();
}
