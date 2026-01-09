import {Request,Response} from "express";
import * as profileService from '../services/profileService.js';


export const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await profileService.getAllProfiles();
        res.json({ profiles });
    } catch (err: any) {
        console.error('Get all profiles error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch profiles' });
    }
};

export const getProfileById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const profile = await profileService.getProfileById(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err: any) {
        console.error('Get profile by ID error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch profile' });
    }
};

export const getProfileAvatar = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const avatar = await profileService.getProfileAvatar(userId);

        if (!avatar?.avatarData || avatar.avatarData.length === 0) {
            return res.status(404).json({ message: 'Avatar not found' });
        }

        res.setHeader('Content-Type', avatar.avatarMime || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        res.send(Buffer.from(avatar.avatarData as any));
    } catch (err: any) {
        console.error('Get avatar error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch avatar' });
    }
};
