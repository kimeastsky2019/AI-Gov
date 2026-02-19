import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gngmeta-ai-gov-secret-2026';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: '인증 토큰이 필요합니다' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: '유효하지 않은 토큰입니다' });
      return;
    }
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: '권한이 부족합니다' });
      return;
    }
    next();
  };
}
