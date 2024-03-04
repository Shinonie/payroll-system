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
export const ApproveLeave = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/leave/leave/approve/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const RejectLeave = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/leave/leave/reject/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
