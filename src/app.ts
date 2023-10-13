import express from 'express';
import log from './logger/logger';
import routes from './routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socket from './socket/socket';
import deserializeUser from './middleware/deserializeUser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from '../config';

const port = config.port as number;
const host = config.host as string;
const corsOrigin = config.corsOrigin as string;

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: corsOrigin, credentials: true, methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
app.use(deserializeUser);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

httpServer.listen(port, host, () => {
  log.info(`Server Listening at http://${host}:${port}`);

  routes(app);
  socket({ io });
});
