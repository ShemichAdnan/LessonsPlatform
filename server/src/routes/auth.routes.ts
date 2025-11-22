import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { setAuthCookies, authGuard } from '../utils/auth.js';

const r = Router();

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol' });

const RegisterDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: passwordSchema,
});

r.post('/register', async (req, res) => {
  try {
    const dto = RegisterDto.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: dto.email }});
    if (exists) {
      res.status(409).json({ message: 'Email exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await prisma.user.create({
      data: { 
        email: dto.email, 
        name: dto.name, 
        passwordHash, 
        subjects: [] 
      }
    });

    setAuthCookies(res, user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }});
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      const issues = e.issues ?? (e as any).errors ?? [];
      const first = issues[0];
      res.status(400).json({ message: first?.message ?? 'Invalid input' });
      return;
    }
    res.status(400).json({ message: 'Invalid input' });
  }
});

const LoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

r.post('/login', async (req, res) => {
  try {
    const dto = LoginDto.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: dto.email }});
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    setAuthCookies(res, user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }});
  } catch (e) {
    res.status(400).json({ message: 'Invalid input' });
  }
});

r.post('/logout', (_req, res) => {
  res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
});

r.get('/me', authGuard, async (req, res) => {
  res.json({ user: (req as any).user });
});

const UpdateProfileDto = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  experience: z.number().int().min(0).max(80).optional(),
  pricePerHour: z.number().int().min(0).max(10000).optional(),
  subjects: z.array(z.string()).optional(),
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
});

r.put('/profile', authGuard, async (req, res) => {
  try {
    const dto = UpdateProfileDto.parse(req.body);
    const userId = (req as any).user.id;

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!existing) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const ok = await bcrypt.compare(dto.currentPassword, existing.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    const { currentPassword, ...data } = dto;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        city: true,
        experience: true,
        pricePerHour: true,
        subjects: true,
      },
    });

    res.json({ user: updated });
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      const issues = e.issues ?? (e as any).errors ?? [];
      const first = issues[0];
      res.status(400).json({ message: first?.message ?? 'Invalid input' });
      return;
    }
    res.status(400).json({ message: 'Invalid input' });
  }
});

export default r;
