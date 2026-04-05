import { CookieOptions } from "express";

export const REFRESH_COOKIE = "refreshToken";

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
  partitioned: true,
};
