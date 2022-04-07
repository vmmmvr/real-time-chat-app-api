import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import log from "./logger/logger";
import validateSocketRequest from "./middleware/vaildateSoketRequest";

const EVENTS = {
  connection: "connection",
  disconnection: "disconnection",
  CLIENT: {
    CREATE_CHANNEL: "CREATE_CHANNEL",
  },
  SERVER: {
    CHANNELS: "CHANNELS",
    JOINT_CHANNEL: "JOINT_CHANNEL",
  },
};

let channels: Record<string, { name: string; username: string }> = {};
let users = [];

function socket({ io }: { io: Server }) {
  log.info("sockets enbled");

  io.use(validateSocketRequest);

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);

    // events
    // socket.emit(EVENTS.SERVER.CHANNELS, channels);
    // socket.broadcast.emit(EVENTS.SERVER.CHANNELS, channels);

    socket.on(EVENTS.CLIENT.CREATE_CHANNEL, ({ channelName, user }) => {
      const channelId = nanoid();
      log.info(user);
      channels[channelId] = {
        name: channelName,
        username: user,
      };

      socket.join(channelId);
      // broadcast an event
      socket.broadcast.emit(EVENTS.SERVER.CHANNELS, channels);

      // emit back to creator with all the channels
      socket.emit(EVENTS.SERVER.CHANNELS, channels);

      // emit back to creator sayiing you joint  channel
      socket.emit(EVENTS.SERVER.JOINT_CHANNEL, channelId);
    });
  });

  io.on(EVENTS.disconnection, (socket: Socket) => {
    log.info(`User disconnect ${socket.id}`);
  });
}

export default socket;
