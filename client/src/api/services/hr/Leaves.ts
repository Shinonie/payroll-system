import { axiosPrivate, axiosInstance } from '@/api';

export const GetAllLeave = async () => {
    try {
        const response = await axiosInstance.get(`/leave/leave`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
