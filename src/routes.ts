import { Express, Request, Response } from "express";

export default function (app: Express) {
    // Health check
    app.get("/", ( req: Request, res: Response ) => res.sendStatus(200))
}