import log from '../../logger/logger';
import { getRoomMessages } from '../../service/message.service';
import { EVENTS } from '../utils/Event.utils';

export const joinRoomHander = async ({ socket, room, user }) => {
  log.info(`${user.name} has joined ${room.name}`);

  // joining the room
  socket.join(room.uuid);
  // get the latest messages
  const latestMessages = await getRoomMessages({ roomuuid: room.uuid });

  // broadcast an event
  // socket.broadcast.to(room.uuid).emit(EVENTS.SERVER.JOINT_ROOM, {
  //   message: `${user.name} has joined ${room.name}`,
  // });

  // emit back to creator sayiing you joint  channel
  socket.emit(EVENTS.SERVER.JOINT_ROOM, {
    message: `${user.name} has joined  ${room.name}`,
    latestMessages,
  });
};

export const leaveRoomHandler = async ({ socket, room, user }) => {
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
};
