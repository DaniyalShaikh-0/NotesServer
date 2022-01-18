require("dotenv").config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "127.0.0.1",
  PORT: process.env.PORT || 10000,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  API: process.env.APITOKEN,
};
