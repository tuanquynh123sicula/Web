import axios from "axios";
export const getMyProfile = async (token) => {
    const { data } = await axios.get('/api/users/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
