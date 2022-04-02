import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import deserializeUser from "./middleware/deserializeUser";
import requireUser from "./middleware/requireUser";
import validateRequest from "./middleware/validateRequest";
import { createUserSessionSchema } from "./Schema/session.schema";
import { createUserSchema } from "./Schema/user.schema";
export default function (app: Express) {
  // Health check
  app.get("/", (req: Request, res: Response) => res.sendStatus(200));

  // user routes
  // register
  app.post("/api/user", validateRequest(createUserSchema), createUserHandler);

  // login
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // logout
  app.delete("/api/sessions", requireUser, invalidateUserSessionHandler);
}
