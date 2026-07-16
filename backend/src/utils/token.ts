import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET || 'supersecretaccesskey123!@#';
  const expiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  return jwt.sign(payload, secret, { expiresIn: expiry as any });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey123!@#';
  const expiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  return jwt.sign(payload, secret, { expiresIn: expiry as any });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET || 'supersecretaccesskey123!@#';
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey123!@#';
  return jwt.verify(token, secret) as TokenPayload;
};
