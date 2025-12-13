import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const authService = {
  async register(data: { email: string; name: string; password: string }) {
    const exists = await userModel.findByEmail(data.email);
    if (exists) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userModel.create({
      email: data.email,
      name: data.name,
      passwordHash,
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateProfile(
    userId: string,
    currentPassword: string,
    data: {
      name?: string;
      bio?: string;
      city?: string;
      experience?: number;
      pricePerHour?: number;
      subjects?: string[];
    }
  ) {
    const user = await userModel.findByIdWithPassword(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    return userModel.updateProfile(userId, data);
  },

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const currentUser = await userModel.findById(userId);
    
    if (currentUser?.avatarUrl) {
      const oldFilePath = path.join(__dirname, '../../uploads/avatars', path.basename(currentUser.avatarUrl));
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.error('Could not delete old avatar:', err);
      }
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return userModel.updateAvatar(userId, avatarUrl);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userModel.findByIdWithPassword(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, newPasswordHash);
  },
  
};
