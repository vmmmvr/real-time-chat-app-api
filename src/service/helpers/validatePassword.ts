import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import log from "../../logger/logger";
import bcrypt from "bcrypt";
import { omit } from "lodash";

export async function validatePassword({
  email,
  password,
}: {
  email: Prisma.UserCreateInput["email"];
  password: Prisma.UserCreateInput["password"];
}) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return false;
  }

  // comparing passwords
  const isValid = await bcrypt
    .compare(password, user.password)
    .catch((e: any) => false);

  if (!isValid) {
    return false;
  }

  return user;
}
