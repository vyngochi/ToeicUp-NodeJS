import nodemailer from "nodemailer";
import { config } from ".";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export const mailer = nodemailer.createTransport({
  host: config.mail.SMTP_HOST,
  port: config.mail.SMTP_PORT,
  secure: config.mail.SMTP_PORT === 465,
  auth: {
    user: config.mail.SMTP_USERNAME,
    pass: config.mail.SMTP_PASSWORD,
  },
});
