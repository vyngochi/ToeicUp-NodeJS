"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const _1 = require(".");
exports.transporter = nodemailer_1.default.createTransport({
    host: _1.config.mail.host,
    port: _1.config.mail.port,
    secure: false,
    auth: {
        user: _1.config.mail.user,
        pass: _1.config.mail.pass,
    },
});
