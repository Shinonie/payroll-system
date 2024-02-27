import { axiosPrivate, axiosInstance } from '@/api';

export const GetUserEmployee = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/employee/employee/${id}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const EditUserProfile = async (userProfile: any) => {
    const { id, data } = userProfile;
    try {
        const response = await axiosInstance.put(`/employee/edit-profile/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
