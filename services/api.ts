import axios from 'axios';
import * as Storage from '../utils/storage';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await Storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
