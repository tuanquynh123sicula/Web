import axios from "axios";

export type UserInfo = {
    _id: string;
    name: string;
    email: string;
    token: string;
    isAdmin: boolean;
    tier?: 'regular' | 'vip' | 'new'
};

export const getMyProfile = async (token: string): Promise<UserInfo> => {
    const { data } = await axios.get('/api/users/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};