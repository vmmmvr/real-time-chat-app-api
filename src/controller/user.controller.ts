import { Request, Response } from 'express';
import { get } from 'lodash';
import { nanoid } from 'nanoid';
import log from '../logger/logger';
import hashingPassword from '../service/helpers/hashingPassword';
import { createUser } from '../service/user.service';

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    // hashing the password
    const hashedPassword = await hashingPassword(get(req.body, 'password'));

    const user = await createUser({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(200).send(user);
  } catch (error: any) {
    log.error(error);

    return res.status(409).send(error.message);
  }
};
