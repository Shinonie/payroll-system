import { axiosPrivate, axiosInstance } from '@/api';

export const GetUserAttendance = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/attendance/attendance/${id}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
