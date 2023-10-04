const config =
  require("./default")["default"][process.env.NODE_ENV || "development"];

export default config;
