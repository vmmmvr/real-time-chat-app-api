import { get } from 'lodash';
import { threadId } from 'worker_threads';
import log from '../logger/logger';
import { reIssueAccessToken } from '../service/session.service';
import { decode } from '../service/utils/jwt.utils';

const validateSocketRequest = async (socket, next) => {
  try {
    // geting access token from headers
    const accessToken = socket.handshake.headers.cookie.split(' ')[1].replace('accessToken=', '');

    if (!accessToken) {
      throw new Error('un authenticated');
    }

    const { decoded, expired } = decode(accessToken);
    if (expired) {
      throw new Error('un authenticated');
    }

    next();
  } catch (error: any) {
    log.error(error.message);
    throw new Error(' cant connect');
  }
};

export default validateSocketRequest;
