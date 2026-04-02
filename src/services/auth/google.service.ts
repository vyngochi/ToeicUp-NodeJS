import { OAuth2Client } from "google-auth-library";
import { config } from "../../config";

const client = new OAuth2Client(config.google.clientId);

export const verifyGoogleToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: config.google.clientId,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Google token không hợp lệ");
  }

  return payload;
};
