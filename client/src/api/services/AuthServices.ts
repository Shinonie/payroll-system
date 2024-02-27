import { axiosInstance } from '../index';

export const login = async (data: any) => {
    const { email, password } = data;
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const ChangePassword = async (data: any) => {
    const { id, newPassword } = data;

    try {
        const response = await axiosInstance.put(`/employee/change-password/${id}`, {
            newPassword
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
