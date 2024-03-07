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

export const GetAllArchiveEmployees = async () => {
    try {
        const response = await axiosInstance.get(`/employee/employees/archive`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const ArchiveEmployees = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/employee/employee`, {
            controlNumber: data.employeeID
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const RecoverArchiveEmployees = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/employee/archive/recover`, {
            controlNumber: data.controlNumber
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const DeleteArchiveEmployees = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/employee/archive/delete`, {
            controlNumber: data.controlNumber
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const CreateEmployeeAccount = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/auth/register`, data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
