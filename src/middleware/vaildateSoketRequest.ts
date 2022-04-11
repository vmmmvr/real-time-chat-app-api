import { get } from "lodash";
import { threadId } from "worker_threads";
import log from "../logger/logger";
import { reIssueAccessToken } from "../service/session.service";
import { decode } from "../service/utils/jwt.utils";

const validateSocketRequest = async (socket, next) => {
  try {
    const accessToken = get(socket, "handshake.headers.authorization");

    if (!accessToken) {
      throw new Error("un authenticated");
    }

    const { decoded, expired } = decode(accessToken);
    if (expired) {
      throw new Error("un authenticated");
    }
    // log.info({ decoded });
    next();
  } catch (error: any) {
    log.error(error.message);
    throw new Error(" cant connect");
  }
};

export default validateSocketRequest;
