import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol' });

export const RegisterDto = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(30),
  password: passwordSchema,
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

export const UpdateProfileDto = z.object({
  name: z.string().min(2).max(30).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().max(30).optional(),
  experience: z.number().int().min(0).max(80).optional(),
  pricePerHour: z.number().int().min(0).max(1000).optional(),
  subjects: z.array(z.string()).optional(),
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: passwordSchema,
});
