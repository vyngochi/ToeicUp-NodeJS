import nodemailer from "nodemailer";
import { config } from ".";

export const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  family: 4,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
} as nodemailer.TransportOptions);
