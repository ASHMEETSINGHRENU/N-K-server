import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export interface JWTPayload {
  userId: string;
  role: 'CLIENT' | 'BROKER' | 'ADMIN';
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JWTPayload;
}
