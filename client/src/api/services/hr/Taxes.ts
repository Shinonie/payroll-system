import { axiosPrivate, axiosInstance } from '@/api';

export const EditTaxes = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/taxes/taxes/${data.id}`, data.data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const GetAllTaxes = async () => {
    try {
        const response = await axiosInstance.get(`/taxes/taxes`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
