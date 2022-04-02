import dotenv from "dotenv";
dotenv.config();

export default {
  corsOrigin: process.env.CORSORIGIN,
  port: process.env.PORT,
  host: process.env.HOST,
  saltWorkFactor: process.env.SALTWORKFACTOR,
  accessTokenTtl: process.env.ACCESSTOKENTTL,
  refreshTokenTtl: process.env.REFRESHTOKENTTL,
  privateKey: process.env.PRIVATEKEY,
};
