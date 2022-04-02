import bcrypt from "bcrypt";
import config from "config";

export default async function hashingPassword(password: string) {
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(password, salt);
  return hash;
}
