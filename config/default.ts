import dotenv from "dotenv";
dotenv.config();

export default {
  corsOrigin: "http://localhost:1330/",
  port: process.env.PORT,
  host: process.env.HOST,
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  privateKey: "SECRET",
};
