import { Prisma } from '@prisma/client';
import { omit } from 'lodash';
import { nanoid } from 'nanoid';
import { prisma } from '../db/prisma';
import log from '../logger/logger';

export async function createUser(input: any) {
  try {
    const uuid = nanoid() as string;
    const user = await prisma.user.create({ data: { ...input, uuid } });

    return omit(user, ['id', 'password']);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      log.error(error.message);

      throw new Error(error.message);
    }
  }
}
