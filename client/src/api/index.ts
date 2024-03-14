import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Create axios instance without bearer token
const axiosInstance = axios.create({
    baseURL: '/api'
});

// Create axios instance with bearer token
const axiosPrivate: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

axiosPrivate.interceptors.request.use((config) => {
    const token = useAuthStore().accessToken;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export { axiosInstance, axiosPrivate };
