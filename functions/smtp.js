"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function SendMail(to, subject, html) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "a.setkaro.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "test@a.setkaro.com", // generated ethereal user
      pass: "Harsh@Singh8576", // generated ethereal password
    },
  });

  // code to generate 6 digit random number for otp
  let otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  otp = otp.toString();
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <test@a.setkaro.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    // code to generate random number for otp and send it to user email
    // text: otp,

    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = SendMail;
