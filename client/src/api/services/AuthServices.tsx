import axios from '../index';

export const login = async (data: any) => {
    const { email, password } = data;
    try {
        const response = await axios.post('/auth/login', {
            email,
            password
        });

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
