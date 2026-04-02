"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../../config");
const client = new google_auth_library_1.OAuth2Client(config_1.config.google.clientId);
const verifyGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: config_1.config.google.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Google token không hợp lệ");
    }
    return payload;
};
exports.verifyGoogleToken = verifyGoogleToken;
