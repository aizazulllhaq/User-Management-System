import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASS, PORT, SERVER_URL } from "../constant.js";

const sendEmailVerificationLink = (username, userEmail, token) => {
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
    subject: "Leave Request",
    html: `<h1>Dear Admin</h1>,<br>
     <p>I hope this email finds you well. I am writing to request leave from work for [duration of leave], starting from [start date] to [end date].</p>
  <br>
  <p>The reason for my leave is [reason for leave]. I have taken all necessary steps to ensure that my responsibilities are covered during my absence, and I am happy to assist with any preparations needed before I leave.</p>
  <br>
  <p>I understand the impact that my absence may have on the team, and I assure you that I will do my best to minimize any disruptions. I will make sure that all pending tasks are completed or delegated before my departure.</p>
  <br>
  <p>Please let me know if you require any further information or if there are any specific procedures I need to follow for this leave request. I am more than happy to discuss this further or provide any additional details.</p>
  <br>
  <p>Thank you for considering my request. I appreciate your understanding and support.</p>
  <br>
  <p>Best regards,</p>
  <p>${username}</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(`Error Occured while Sending Mail : ${err}`);

    return console.log(`Email has been send : ${info}`);
  });
};

export default sendEmailVerificationLink;
