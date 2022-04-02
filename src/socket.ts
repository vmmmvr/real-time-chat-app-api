import { Server, Socket } from "socket.io";
import log from "./logger/logger";

const EVENTS = { connection: "connection", disconnection: "disconnection" };
const allMessages: string[] = [];

function socket({ io }: { io: Server }) {
  log.info("sockets enbled");

  io.use((socket, next) => {
    console.log(socket.handshake.headers["x-auth-token"]);
    next();
  });

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);

    // events
    // add new message
    socket.on("message", (message) => {
      allMessages.push(message);
      io.sockets.emit("messages", [...allMessages]);
    });

    // get all messages
    socket.on("getMessages", () => {
      socket.emit("messages", [...allMessages]);
    });
  });

  io.on(EVENTS.disconnection, (socket: Socket) => {
    log.info(`User disconnect ${socket.id}`);
  });
}

export default socket;
