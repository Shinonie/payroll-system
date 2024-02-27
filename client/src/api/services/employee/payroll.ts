import { axiosPrivate, axiosInstance } from '@/api';

export const GetUserPayroll = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/payroll/payroll/${id}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
