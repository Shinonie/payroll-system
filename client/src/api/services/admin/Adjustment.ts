import { axiosPrivate, axiosInstance } from '@/api';

export const GetAllAdjustment = async () => {
    try {
        const response = await axiosInstance.get(`/adjustments/adjustments`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
