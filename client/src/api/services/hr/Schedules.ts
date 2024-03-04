import { axiosPrivate, axiosInstance } from '@/api';

export const GetScheduleByEmployee = async (data: any) => {
    try {
        const response = await axiosInstance.get(`/schedule/schedule/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
export const EditSchedule = async (data: any) => {
    const { id, time } = data;
    try {
        const response = await axiosInstance.put(`/schedule/schedule/${id}`, { time });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const CreateSchedule = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/schedule/schedule`, data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
