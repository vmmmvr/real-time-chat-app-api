import { Request, Response, NextFunction } from "express";
import log from "../logger/logger";
import { AnySchema } from "yup";

const validate = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: any) {
      log.error(error);

      return res.status(400).send(error.errors);
    }
  };
};

export default validate;
