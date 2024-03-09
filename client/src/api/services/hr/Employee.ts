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

export const EditUserProfile = async (userProfile: any) => {
    const { employeeID, data } = userProfile;
    try {
        const response = await axiosInstance.put(`/employee/edit-profile/${employeeID}`, data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
