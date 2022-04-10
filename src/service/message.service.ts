import { prisma } from "../db/prisma";
import log from "../logger/logger";
export async function createMessage(input: any) {
  try {
    const message = await prisma.message.create({
      data: {
        ...input,
      },
    });

    return await prisma.message.findFirst({
      where: { uuid: message.uuid },
      include: { sender: true, room: true, channel: true },
    });
  } catch (error: any) {
    return new Error(error.message);
  }
}

export async function getRoomMessages(query: any) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        roomuuid: query.roomuuid,
      },
      include: {
        sender: true,
      },
    });

    return messages;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}
