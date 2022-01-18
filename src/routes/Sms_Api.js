// DONE SMS API

const https = require("https");
const config = require("../config");
const sendSMS = (request, response) => {
  const api_token = config.API;
  const sender = "8583";
  const { otp, receiver } = request.body;
  let message = `Welcome to BidGainer, your otp is ${otp}`;
  let Api = `https://api.veevotech.com/sendsms?hash=${api_token}&receivenum=${receiver}&sendernum=${sender}&textmessage=${message}`;
  const req = https.request(Api, (res) => {
    // console.log(
    //   `statusCode: ${res.statusCode} \n`,
    //   res.statusMessage,
    //   "\n",
    //   res.complete,
    //   "\n",
    //   res.headers
    // );
    res.on("data", (chunk) => {
      chunk.status === "ACCEPTED"
        ? response.send("Otp has been sent")
        : response.send("OTP failed because of invalid number");
    });
  });
  req.on("error", (error) => {
    console.error(error);
    response.status(301).send(error.message);
  });
  req.end();
};
// https.get();
module.exports = sendSMS;
