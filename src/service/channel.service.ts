import { nanoid } from "nanoid";
import { prisma } from "../db/prisma";
import log from "../logger/logger";

export async function createChannel(input: any) {
  try {
    const channel = await prisma.channel.create({
      data: {
        uuid: nanoid(),
        name: input.name,
        creatoruuid: input.useruuid,
        private: input.private,
        users: {
          create: [
            {
              user: {
                connect: {
                  uuid: input.useruuid,
                },
              },
            },
          ],
        },
      },
    });

    return channel;
  } catch (error: any) {
    log.info(error.message);

    throw new Error(error.message);
  }
}

export async function getChannels(input: any) {
  try {
    const channels = await prisma.channel.findMany({
      where: {
        ...input,
      },
      include: {
        users: {
          select: {
            user: true,
          },
        },
        rooms: {
          include: {
            messages: {
              include: {
                sender: true,
              },
            },
          },
        },
      },
    });

    return channels;
  } catch (error: any) {
    log.error(error.message);

    throw new Error(error.message);
  }
}

export async function updateChannel(query, input: any) {
  try {
    const updatedChannel = await prisma.channel.update({
      where: {
        ...query,
      },
      data: {
        ...input,
      },
    });

    return updatedChannel;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function deleteChannel(query: any) {
  try {
    const channel = await prisma.channel.findFirst({
      where: { uuid: query.uuid },
    });

    const deletedChannel = await prisma.channel.delete({
      where: {
        id: channel.id,
      },
    });
    return deletedChannel;
  } catch (error: any) {
    log.error(error.message);

    return new Error(error.message);
  }
}

export async function joinChannel(input: any) {
  try {
    const joinedChannel = await prisma.channel.update({
      where: {
        uuid: input.channeluuid,
      },
      data: {
        users: {
          create: [
            {
              user: {
                connect: {
                  uuid: input.useruuid,
                },
              },
            },
          ],
        },
      },
    });

    return joinedChannel;
  } catch (error: any) {
    log.error(error.message);

    throw new Error(error.message);
  }
}
