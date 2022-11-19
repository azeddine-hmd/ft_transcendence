import { expiresMaxTime } from './constants';

export const refreshCookieOptions = {
  httpOnly: true,
  expires: expiresMaxTime,
  path: '/api/auth/refresh',
  maxAge: expiresMaxTime.getTime(),
};

export const accessCookieOptions = {
  // httpOnly: true,
  expires: expiresMaxTime,
  maxAge: expiresMaxTime.getTime(),
};
