import { NextFunction, Response } from "express";
import { get } from "lodash";
import RequestWithUser from "../Interfaces/RequestWithUser";
import log from "../logger/logger";
import { createMessage } from "../service/message.service";

export const createMessageHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const messageBody = {
      message: get(req, "body.message"),
      roomuuid: get(req, "body.roomuuid"),
      channeluuid: get(req, "body.channeluuid"),
      senderuuid: get(req, "body.senderuuid"),
    };

    const message = await createMessage({ ...messageBody });

    return res.status(200).send(message);
  } catch (error: any) {
    log.error(error.message);

    return res.status(500).send(error.message);
  }
};
// export const createMessageHandler = async (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//     try {

//     } catch (error: any) {
//         log.error(error.message);

//         return res.status(500).send(error.message);
//     }
// };
