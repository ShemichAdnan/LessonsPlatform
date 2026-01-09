import {userModel}  from '../models/userModel.js';

export interface Profile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
    createdAt?: Date;
    experience?: number | null;
    pricePerHour?: number | null;
    subjects?: string[] | null;
    city?: string | null;
}

export const getAllProfiles = async (): Promise<Profile[]> => {
    try {
        const users = await userModel.listProfiles();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatarUrl: u.avatarUrl ?? null,
            bio: u.bio,
            subjects: u.subjects as string[] | null,

        }));
    } catch (error) {
        throw new Error('Failed to fetch profiles');
    }
}

export const getProfileById = async (userId: string): Promise<Profile | null> => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl ?? null,
            bio: user.bio,        
            createdAt: user.createdAt,
            experience: user.experience,
            pricePerHour: user.pricePerHour,
            subjects: user.subjects as string[] | null,
            city: user.city,
        };
    } catch (error) {
        throw new Error('Failed to fetch profile');
    }
}

export const getProfileAvatar = async (userId: string) => {
    try {
        return await userModel.getAvatarData(userId);
    } catch {
        throw new Error('Failed to fetch avatar');
    }
}
