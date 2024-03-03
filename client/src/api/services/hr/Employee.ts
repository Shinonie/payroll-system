import { axiosPrivate, axiosInstance } from '@/api';

export const GetAllEmployees = async () => {
    try {
        const response = await axiosInstance.get(`/employee/employees`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
