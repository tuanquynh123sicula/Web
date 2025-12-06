export type User = {
    _id: string;
    name: string;
    email: string;
    token: string;
    isAdmin: boolean;
    tier?: 'regular' | 'vip' | 'new'
};

