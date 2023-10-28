import { Request } from 'express';

export function extractJwtFromCookie (req: Request) {
  if (req.signedCookies.refreshToken === undefined) {
    return null;
  }

 return req.signedCookies.refreshToken;
}
