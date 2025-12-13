import { prisma } from '../utils/prisma.js';

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  bio: true,
  city: true,
  experience: true,
  pricePerHour: true,
  subjects: true,
};

export const userModel = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ 
      where: { email },
      select: {
        ...userSelect,
        passwordHash: true,
      }
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
  },

  async create(data: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        ...data,
        subjects: [],
      },
      select: userSelect,
    });
  },

  async updateProfile(id: string, data: {
    name?: string;
    bio?: string;
    city?: string;
    experience?: number;
    pricePerHour?: number;
    subjects?: string[];
  }) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  },

  async updateAvatar(id: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: userSelect,
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async listProfiles() {
    return prisma.user.findMany({
      select:{
        id: true,
        name: true,
        avatarUrl: true,
      }
    });
  }
};
