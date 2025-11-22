import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';
import { prisma } from './prisma.js';

const sign = (payload: string | object | Buffer, secret: Secret, expiresIn: string | number) =>
  jwt.sign(payload, secret, { expiresIn } as SignOptions);

export function setAuthCookies(res: Response, user: { id: string }) {
  const access = sign({ sub: user.id }, process.env.JWT_SECRET!, '15m');
  const refresh = sign({ sub: user.id }, process.env.REFRESH_TOKEN_SECRET!, '7d');
  
  const common = { 
    httpOnly: true, 
    sameSite: 'lax' as const, 
    secure: process.env.NODE_ENV === 'production' 
  };
  
  res.cookie('accessToken', access, { ...common, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refresh, { ...common, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ 
      where: { id: payload.sub }, 
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }
    
    (req as any).user = user;
    next();
  } catch (e) {
    console.error('Auth guard error:', e);
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }
}
