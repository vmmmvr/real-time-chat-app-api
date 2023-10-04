import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import log from '../logger/logger';
import validateSocketRequest from '../middleware/vaildateSoketRequest';
import { getRoomMessages } from '../service/message.service';
import { joinRoomHander, leaveRoomHandler } from './controllers/channel.socket.controller';
import { sendMessageHandler } from './controllers/message.socket.controller';
import { EVENTS } from './utils/Event.utils';

// let channels: Record<string, { name: string; username: string }> = {};
// let users = [];

function socket({ io }: { io: Server }) {
  log.info('sockets enbled');

  io.use(validateSocketRequest);

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);

    // events
    // socket.emit(EVENTS.SERVER.CHANNELS, channels);
    // socket.broadcast.emit(EVENTS.SERVER.CHANNELS, channels);

    socket.on(EVENTS.CLIENT.JOINT_ROOM, async ({ room, user }) => joinRoomHander({ socket, room, user }));

    // leave the room
    socket.on(EVENTS.CLIENT.LEAVE_ROOM, ({ room, user }) => leaveRoomHandler({ socket, room, user }));

    // messgeing
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, ({ sendedMessage }) => sendMessageHandler({ socket, sendedMessage }));
  });

  io.on(EVENTS.disconnection, (socket: Socket) => {
    log.info(`User disconnect ${socket.id}`);
  });
}

export default socket;
