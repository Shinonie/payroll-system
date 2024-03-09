import { axiosPrivate, axiosInstance } from '@/api';

export const UpdatePayrollStatus = async (data: any) => {
    const { employeeID, payrollID } = data;
    try {
        const response = await axiosInstance.put(`/payroll/payroll/${employeeID}`, { payrollID });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const GetAllPayroll = async () => {
    try {
        const response = await axiosInstance.get(`/payroll/payroll`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const GetAllPayrollByEmployee = async (data: any) => {
    try {
        const response = await axiosInstance.get(`/payroll/payroll/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const CreatePayroll = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/payroll/payroll`, data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const GetPayrollPreview = async (data: any) => {
    try {
        const response = await axiosInstance.get(`/payroll/payroll/preview/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const CreateBulkPayroll = async () => {
    try {
        const response = await axiosInstance.get(`/payroll/payroll/bulk`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
