import { axiosPrivate, axiosInstance } from '@/api';

export const GetUserSchedule = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/schedule/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
