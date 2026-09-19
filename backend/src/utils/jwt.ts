import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenAudience = 'user' | 'admin';

const ISSUER = 'tegron-printables';

export function signToken(subject: string, audience: TokenAudience): string {
  const expiresIn = (audience === 'admin' ? env.ADMIN_JWT_EXPIRES_IN : env.JWT_EXPIRES_IN) as SignOptions['expiresIn'];
  return jwt.sign({}, env.JWT_SECRET, {
    subject,
    audience,
    issuer: ISSUER,
    algorithm: 'HS256',
    expiresIn,
  });
}

/** Throws if the token is invalid, expired or issued for a different audience. */
export function verifyToken(token: string, audience: TokenAudience): string {
  const payload = jwt.verify(token, env.JWT_SECRET, {
    audience,
    issuer: ISSUER,
    algorithms: ['HS256'],
  });
  if (typeof payload === 'string' || !payload.sub) throw new Error('Malformed token');
  return payload.sub;
}
