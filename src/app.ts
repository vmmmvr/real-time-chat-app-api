import express from "express";
import config from "config";
import log from "./logger/logger";
import routes from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";
import deserializeUser from "./middleware/deserializeUser";
const cors = require("cors");

const app = express();
app.use(deserializeUser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = config.get("port") as number;
const host = config.get("host") as string;
const corsOrigin = config.get("corsOrigin") as string;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // credentials: true,
    methods: ["GET", "POST"],
  },
});

httpServer.listen(port, host, () => {
  log.info(`Server Listening at http://${host}:${port}`);

  routes(app);

  socket({ io });
});
