import { query } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma";
import log from "../logger/logger";

export async function createRoom(input: any) {
  try {
    const room = await prisma.room.create({
      data: {
        uuid: nanoid(),
        name: input.name,
        private: input.private,
        channeluuid: input.channeluuid,
      },
    });

    return room;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function getRooms(query: any) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        channeluuid: query.channeluuid,
      },
      include: {
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    return rooms;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function getRoom(query: any) {
  try {
    const room = await prisma.room.findFirst({
      where: {
        channeluuid: query.channeluuid,
        uuid: query.roomuuid,
      },
      include: {
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    return room;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function updateRoom(input: any, query: any) {
  try {
    const room = await prisma.room.update({
      where: {
        uuid: query.roomuuid,
      },
      data: {
        ...input,
      },
    });

    return room;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function deleteRoom(query: any) {
  try {
    const deletedRoom = await prisma.room.delete({
      where: {
        uuid: query.roomuuid,
      },
    });

    return deleteRoom;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}
