import {userModel}  from '../models/userModel.js';

export interface Profile {
    id: string;
    name: string;
    avatarUrl?: string | null;
}

export const getAllProfiles = async (): Promise<Profile[]> => {
    try {
        const users = await userModel.listProfiles();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            avatarUrl: u.avatarUrl && u.avatarUrl.trim() !== '' ? u.avatarUrl : null,
        }));
    } catch (error) {
        throw new Error('Failed to fetch profiles');
    }
}
