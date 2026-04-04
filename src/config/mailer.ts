import { MailerSend } from "mailersend";
import { config } from ".";

export const mailerSend = new MailerSend({
  apiKey: config.mail.API_KEY!,
});

export * from "mailersend";
