import axios from "axios";

export type UserInfo = {
    name: string;
    email: string;
    token: string;
    isAdmin: boolean;
    tier?: 'regular' | 'vip' | 'new'
};

export const getMyProfile = async (): Promise<UserInfo> => {
    const { data } = await axios.get('/api/users/profile')
    return data
}