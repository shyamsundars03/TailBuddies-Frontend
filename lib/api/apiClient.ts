

import axios from 'axios';
import logger from '../logger';
import { clientCookies } from '../utils/clientCookies';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});







// Request interceptor 
apiClient.interceptors.request.use(
    (config) => {

        const token = clientCookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        logger.debug('API Request', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data
        });
        return config;
    },
    (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
    }
);







// Response interceptor 
apiClient.interceptors.response.use(
    (response) => {
        logger.debug('API Response', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        logger.error('API Response Error', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });

        // Handle account blocked in real-time
        if (error.response?.status === 403 && error.response?.data?.message === 'Account is blocked') {
            localStorage.removeItem('user');
            clientCookies.delete('token');
            window.location.href = '/signin?error=blocked';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
