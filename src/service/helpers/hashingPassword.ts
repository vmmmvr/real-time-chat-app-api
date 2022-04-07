import bcrypt from "bcrypt";
import config from "config";
import log from "../../logger/logger";

export default async function hashingPassword(password: string) {
  const saltfactor: number = config.get<number>("saltWorkFactor");
  const salt = await bcrypt.genSalt(+saltfactor);

  const hash = await bcrypt.hashSync(password, salt);
  return hash;
}
