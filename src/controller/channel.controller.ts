import { NextFunction, Response } from 'express';
import { get } from 'lodash';
import RequestWithUser from '../Interfaces/RequestWithUser';
import log from '../logger/logger';
import { createChannel, deleteChannel, getChannels, joinChannel, updateChannel } from '../service/channel.service';
import { createRoom } from '../service/room.service';

export const createChannelHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const useruuid = get(req, 'user.uuid');

    const channel = await createChannel({
      name: req.body.name,
      private: req.body.private,
      useruuid,
    });
    const room = await createRoom({
      name: 'General',
      channeluuid: channel.uuid,
      private: false,
    });
    return res.status(200).send(channel);
  } catch (error: any) {
    log.error(error.message);

    res.status(500).send(error.message);
  }
};

export const getChannelsHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const publicChannels = await getChannels({ private: false });

    return res.status(200).send(publicChannels);
  } catch (error: any) {
    log.error(error.message);

    return res.status(404).send(error.message);
  }
};

export const getMyChannelsHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const publicChannels = await getChannels({ private: true, creatoruuid: req.user.uuid });

    return res.status(200).send(publicChannels);
  } catch (error: any) {
    log.error(error.message);

    return res.status(404).send(error.message);
  }
};

export const getChannelHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const channdeluuid = get(req, 'params.uuid');

    const channel = await getChannels({ uuid: channdeluuid });

    return res.status(200).send(channel[0]);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const updateChannelHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const channeluuid = get(req, 'params.uuid');

    const channel = await updateChannel({ uuid: channeluuid }, { ...get(req, 'body') });

    return res.status(200).send(channel);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const deleteChannelHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const channeluuid = get(req, 'params.uuid');

    const channel = await deleteChannel({ uuid: channeluuid });

    return res.sendStatus(200);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const jointChannelHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const useruuid = get(req, 'user.uuid');
    const channeluuid = req.body.uuid;
    const jointedChannel = await joinChannel({ useruuid, channeluuid });

    return res.status(200).send(jointedChannel);
  } catch (error: any) {
    log.error(error.message);

    return res.status(404).send(error.message);
  }
};

const createRoomHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {};
