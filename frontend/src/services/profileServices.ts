import { api } from "./api";

export interface Profile {
    id: string;
    name: string;
    avatarUrl?: string | null;
}
export const getAllProfiles = async (): Promise<Profile[]> => {
    const response = await api.get('/profiles');
    return response.data.profiles;
}