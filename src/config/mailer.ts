import nodemailer from "nodemailer";
import { config } from ".";

export const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: true,
  family: 4,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
} as nodemailer.TransportOptions);
