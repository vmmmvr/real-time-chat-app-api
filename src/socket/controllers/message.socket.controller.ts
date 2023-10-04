import { EVENTS } from '../utils/Event.utils';

export const sendMessageHandler = async ({ socket, sendedMessage }) => {
  // broadcast an event
  socket.broadcast.to(sendedMessage.roomuuid).emit(EVENTS.SERVER.NEW_MESSAGE, {
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
};
