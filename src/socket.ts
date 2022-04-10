import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import log from "./logger/logger";
import validateSocketRequest from "./middleware/vaildateSoketRequest";
import { getRoomMessages } from "./service/message.service";

const EVENTS = {
  connection: "connection",
  disconnection: "disconnection",
  CLIENT: {
    JOINT_ROOM: "JOINT_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    NEW_MESSAGE: "NEW_MESSAGE",
  },
  SERVER: {
    JOINT_ROOM: "JOINT_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    NEW_MESSAGE: "NEW_MESSAGE",
    MESSAGE_NOTIFICATION: "MESSAGE_NOTIFICATION",
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

    socket.on(EVENTS.CLIENT.JOINT_ROOM, async ({ room, user }) => {
      log.info(`${user.name} has joined the room`);

      socket.join(room.uuid);
      // get the latest messages
      const latestMessages = await getRoomMessages({ roomuuid: room.uuid });
      // log.info({ latestMessages });
      // broadcast an event
      // socket.broadcast.to(room.uuid).emit(EVENTS.SERVER.JOINT_ROOM, {
      //   message: `${user.name} has joined ${room.name}`,
      // });

      // emit back to creator with all the channels
      // socket.emit(EVENTS.SERVER.JOINT_ROOM, { message: "joined" });

      // emit back to creator sayiing you joint  channel
      socket.emit(EVENTS.SERVER.JOINT_ROOM, {
        message: `${user.name} has joined  ${room.name}`,
        latestMessages,
      });
    });

    // leave the room
    socket.on(EVENTS.CLIENT.LEAVE_ROOM, ({ room, user }) => {
      log.info(`${user.name} has Leaved ${room.name}`);
      socket.leave(room.uuid);

      // // broadcast an event
      // socket.broadcast.emit(EVENTS.SERVER.JOINT_ROOM, {
      //   message: `${user.name} has Leaved ${room.name}`,
      // });

      // emit back to creator with all the channels
      // socket.emit(EVENTS.SERVER.JOINT_ROOM, { message: "joined" });

      // emit back to creator sayiing you joint  channel
      socket.emit(EVENTS.SERVER.JOINT_ROOM, {
        message: `${user.name} has Leaved ${room.name}`,
      });
    });

    // messgeing
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, ({ sendedMessage }) => {
      // broadcast an event
      socket.broadcast
        .to(sendedMessage.roomuuid)
        .emit(EVENTS.SERVER.NEW_MESSAGE, {
          newMessage: sendedMessage,
        });
      // emit back the message
      socket.emit(EVENTS.SERVER.NEW_MESSAGE, {
        newMessage: sendedMessage,
      });

      // send notification about the message
      socket.broadcast.emit(EVENTS.SERVER.MESSAGE_NOTIFICATION, {
        notification: `there is new messages in ${sendedMessage.channel.name} Channel - at ${sendedMessage.room.name} Room`,
      });
    });
  });

  io.on(EVENTS.disconnection, (socket: Socket) => {
    log.info(`User disconnect ${socket.id}`);
  });
}

export default socket;
