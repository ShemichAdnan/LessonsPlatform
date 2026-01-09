import { prisma } from '../utils/prisma.js';
import { createAd } from './adModel.js';
import { withAvatarUrl } from '../utils/avatar.js';

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatarMime: true,
  bio: true,
  city: true,
  experience: true,
  pricePerHour: true,
  subjects: true,
  createdAt: true,
};

export const userModel = {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        ...userSelect,
        passwordHash: true,
      }
    });

    return user ? withAvatarUrl(user) : null;
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    return user ? withAvatarUrl(user) : null;
  },

  async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
  },

  async create(data: { email: string; name: string; passwordHash: string }) {
    const user = await prisma.user.create({
      data: {
        ...data,
        subjects: [],
      },
      select: userSelect,
    });

    return withAvatarUrl(user);
  },

  async updateProfile(id: string, data: {
    name?: string;
    bio?: string;
    city?: string;
    experience?: number;
    pricePerHour?: number;
    subjects?: string[];
  }) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    return withAvatarUrl(user);
  },

  async updateAvatarData(id: string, avatarData: Buffer, avatarMime: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        avatarData,
        avatarMime,
      },
      select: userSelect,
    });

    return withAvatarUrl(user);
  },

  async getAvatarData(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        avatarData: true,
        avatarMime: true,
      },
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async listProfiles() {
    const users = await prisma.user.findMany({
      select:{
        id: true,
        name: true,
        avatarMime: true,
        bio: true,
        email: true,
        subjects: true,
      }
    });

    return users.map(u => withAvatarUrl(u as any));
  }
};
