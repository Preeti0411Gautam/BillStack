import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
 service: "gmail",
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASS,
  },
});


export default transporter;

