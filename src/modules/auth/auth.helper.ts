import { Request } from 'express';

export const extractJwtFromCookie = (req: Request) => {
  if (req.signedCookies.refreshToken === undefined) {
    return null;
  }

  return req.signedCookies.authToken;
}
