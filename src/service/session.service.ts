import { Prisma, User, Session } from "@prisma/client";
import { get, omit } from "lodash";
import { prisma } from "../db/prisma";
import log from "../logger/logger";
import config from "config";
import { decode, sign } from "./utils/jwt.utils";

// creatin a session
export async function createSession(input: any) {
  try {
    const session = await prisma.session.create({
      data: {
        userAgent: input.userAgent,
        valid: input.valid,
        userId: input.user.uuid,
      },
    });

    return session;
  } catch (error: any) {
    log.error(error.message);
  }
}

// create access toekn
export async function createAccesstoken({
  user,
  session,
}: {
  user: User;
  session: Session;
}) {
  const accessToken = sign(
    { ...user, session: session.uuid },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}

// reIssue access token
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = decode(refreshToken);

  if (!decoded || get(decoded, "uuid")) return false;

  // get the session
  const session = await prisma.session.findFirst({
    where: {
      uuid: get(decoded, "uuid"),
    },
  });

  // make sure the session is still valid
  if (!session || !session?.valid) return false;

  // get the user
  const user = await prisma.user.findFirst({
    where: {
      uuid: session.userId,
    },
  });

  if (!user) return false;

  const accessToken = createAccesstoken({ user, session });

  return accessToken;
}

// update session
export async function updateSession(uuid: string, value: any) {
  const updatedSession = await prisma.session.update({
    where: {
      uuid: uuid,
    },
    data: {
      valid: false,
    },
  });
  log.info(updatedSession);
  return updateSession;
}
