import { CookieOptions } from 'express-serve-static-core';

const day = 86400000;

export const expiresMaxTime = new Date(new Date().getTime() * 1000 * day * 100);

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  expires: expiresMaxTime,
  maxAge: day * 365,
  path: '/api/auth/refresh',
};

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  expires: expiresMaxTime,
  maxAge: day * 365,
};
