import bcrypt from 'bcrypt';
import log from '../../logger/logger';
import config from '../../../config';

export default async function hashingPassword(password: string) {
  const saltfactor: number = config.saltWorkFactor;
  const salt = await bcrypt.genSalt(+saltfactor);

  const hash = await bcrypt.hashSync(password, salt);
  return hash;
}
