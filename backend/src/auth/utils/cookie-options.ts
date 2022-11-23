import { CookieOptions } from 'express-serve-static-core';

export const expiresMaxTime = new Date(new Date().getTime() + 9999999999);

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  expires: expiresMaxTime,
  path: '/api/auth/refresh',
  maxAge: expiresMaxTime.getTime(),
  sameSite: 'strict',
};

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  expires: expiresMaxTime,
  maxAge: expiresMaxTime.getTime(),
  sameSite: 'strict',
};
