import { axiosPrivate, axiosInstance } from '@/api';

export const GetAttendance = async (data: any) => {
    try {
        const response = await axiosInstance.get(`/attendance/attendance/${data}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const UpdateAttendance = async (data: any) => {
    const { id, attendance_id, formattedData } = data;
    try {
        const response = await axiosInstance.put(
            `/attendance/attendance/${id}/${attendance_id}`,
            formattedData
        );
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const UploadAttendance = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/attendance/upload`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
