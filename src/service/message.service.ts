import { prisma } from "../db/prisma";
export async function createMessage(input: any) {
  try {
    const message = await prisma.message.create({
      data: {
        ...input,
      },
    });

    return message;
  } catch (error: any) {
    return new Error(error.message);
  }
}
