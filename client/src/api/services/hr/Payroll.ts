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
