import { NextFunction, Response } from "express";
import { get } from "lodash";
import RequestWithUser from "../Interfaces/RequestWithUser";
import log from "../logger/logger";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "../service/room.service";

export const createRoomHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await createRoom({
      name: req.body["name"],
      channeluuid: req.body["channeluuid"],
      private: req.body["private"],
    });

    return res.status(200).send(room);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const getRoomHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await getRoom({
      channeluuid: req.body["channeluuid"],
      roomuuid: req.body["roomuuid"],
    });

    return res.status(200).send(room);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const getRoomsHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const rooms = await getRooms({ channeluuid: req.params["channeluuid"] });

    return res.status(200).send(rooms);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const updateRoomHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await updateRoom(
      { ...req["body"] },
      { roomuuid: req.params["roomuuid"] }
    );

    return res.status(200).send(room);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};

export const deleteRoomHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await deleteRoom({ roomuuid: req.params["roomuuid"] });

    return res.sendStatus(200);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};
