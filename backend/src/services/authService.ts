import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';

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
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('Empty file');
    }

    const mime = file.mimetype || 'application/octet-stream';
    return userModel.updateAvatarData(userId, file.buffer, mime);
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
