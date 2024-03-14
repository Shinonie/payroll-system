import { axiosPrivate, axiosInstance } from '@/api';

export const CreateLeave = async (data: any) => {
    const { employeeID, leaveType, startDate, endDate, totalDays } = data;

    console.log(data);
    try {
        const response = await axiosInstance.post('/leave/leave', {
            employeeID,
            leaveType,
            startDate,
            endDate,
            totalDays
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const GetUserLeave = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/leave/leave/${id}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
