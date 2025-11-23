import { api } from './api';
import type { User } from '../App';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post<{ user: User }>('/auth/login', data);
  return response.data.user;
};

export const register = async (data: { email: string; name: string; password: string }) => {
  const response = await api.post<{ user: User }>('/auth/register', data);
  return response.data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch {
    return null;
  }
};

export const updateProfile = async (data: {
  name?: string;
  bio?: string;
  city?: string;
  experience?: number;
  pricePerHour?: number;
  subjects?: string[];
  currentPassword: string;
}) => {
  const response = await api.put<{ user: User }>('/auth/profile', data);
  return response.data.user;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post<{ user: User }>('/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.user;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put<{ message: string }>('/auth/change-password', data);
  return response.data;
};
