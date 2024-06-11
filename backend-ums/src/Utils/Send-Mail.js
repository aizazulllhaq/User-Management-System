import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASS } from "../constant.js";

const sendMail = (userEmail, mailSubject, mailBody) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS,
    },
    connectionTimeout: 60000,
  });

  const mailOptions = {
    from: EMAIL,
    to: userEmail,
    subject: mailSubject,
    html: mailBody,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(`Error Occured while Sending Mail : ${err}`);

    return console.log(`Email has been send : ${info.response}`);
  });
};

export default sendMail;
