import { get } from "lodash";
import { threadId } from "worker_threads";
import log from "../logger/logger";

const validateSocketRequest = async (socket, next) => {
  try {
    const accessToken = get(socket, "handshake.headers.access-token");
    log.info(accessToken);
    if (!accessToken) throw new Error("un authenticated");

    next();
  } catch (error: any) {
    throw new Error(" cant connect");
  }
};

export default validateSocketRequest;
