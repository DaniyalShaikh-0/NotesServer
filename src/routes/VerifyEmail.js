const nodemailer = require("nodemailer");
const config = require("../config");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});
// trasnporter.MailMessage.
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

const sendMail = (req, res) => {
  const { otp, receiver } = req.body; // ?POST OR GET
  // ! WILL SEE IT
  // doing rightnow post
  let message = {
    from: config.EMAIL,
    to: receiver,
    subject: "BidGainer : Verify your Email Address",
    html: `<h1>Welcome To BidGainer</h1><h3>Your OTP For Verification is : <h2>${otp}</h2>  </h3>`,
    //   html: `<h2>HTML version of the message ${otp} is otp</h2>`,
  };

  transporter.sendMail(message, (err, info) => {
    err
      ? res
          .status(301)
          .send({ err: err, data: "no email sent", response: false })
      : res.send({ data: info, sent: "email sent", response: true });
  });
};
module.exports = sendMail;
