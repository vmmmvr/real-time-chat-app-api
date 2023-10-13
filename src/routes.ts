import { Express, Request, Response } from 'express';
import {
  createChannelHandler,
  deleteChannelHandler,
  getChannelHandler,
  getChannelsHandler,
  getMyChannelsHandler,
  jointChannelHandler,
  updateChannelHandler,
} from './controller/channel.controller';
import { createMessageHandler } from './controller/message.controller';
import { createRoomHandler, deleteRoomHandler, getRoomHandler, getRoomsHandler, updateRoomHandler } from './controller/room.controller';
import { createUserSessionHandler, getUserSessionHandler, invalidateUserSessionHandler } from './controller/session.controller';
import { createUserHandler } from './controller/user.controller';
import deserializeUser from './middleware/deserializeUser';
import requireUser from './middleware/requireUser';
import validateRequest from './middleware/validateRequest';
import { joinChannelSchema, updateChannelSchema } from './Schema/channel.schema';
import { createMessageSchema } from './Schema/message.schema';
import { createRoomSchema, deleteRoomSchema, getRoomSchema, getRoomsSchema, updateRoomSchema } from './Schema/room.schema';
import { createUserSessionSchema } from './Schema/session.schema';
import { createUserSchema } from './Schema/user.schema';
import { ipThrottler } from './middleware/ip-throttle';
export default function (app: Express) {
  // Health check
  app.get('/', (req: Request, res: Response) => res.sendStatus(200));

  // user routes
  app.get('/api/me', [requireUser], getUserSessionHandler);
  // register
  app.post('/api/user', validateRequest(createUserSchema), createUserHandler);

  // login
  app.post('/api/sessions', [validateRequest(createUserSessionSchema)], createUserSessionHandler);

  // logout
  app.delete('/api/sessions', requireUser, invalidateUserSessionHandler);

  // channels
  // create a channel
  app.post('/api/channels', requireUser, createChannelHandler);

  // get public channels
  app.get('/api/channels', getChannelsHandler);
  app.get('/api/channels/me', requireUser, getMyChannelsHandler);

  // get single channel
  app.get('/api/channels/:uuid', getChannelHandler);

  // update  channel information
  app.put('/api/channels/:uuid', [validateRequest(updateChannelSchema), requireUser], updateChannelHandler);

  // delete channel
  app.delete('/api/channels/:uuid', requireUser, deleteChannelHandler);

  // join a channel
  app.post('/api/channels/join', [validateRequest(joinChannelSchema), requireUser], jointChannelHandler);

  // rooms
  // create room
  app.post('/api/rooms', [validateRequest(createRoomSchema), requireUser], createRoomHandler);

  // get single room
  app.get('/api/rooms/:roomuuid', [validateRequest(getRoomSchema), requireUser], getRoomHandler);

  // get  rooms
  app.get('/api/rooms/all/:channeluuid', [validateRequest(getRoomsSchema), requireUser], getRoomsHandler);

  // update room
  app.put('/api/rooms/:roomuuid', [validateRequest(updateRoomSchema), requireUser], updateRoomHandler);

  // delete room
  app.delete('/api/rooms/:roomuuid', [validateRequest(deleteRoomSchema), requireUser], deleteRoomHandler);

  // messages
  app.post('/api/messages', [validateRequest(createMessageSchema), requireUser], createMessageHandler);
}
