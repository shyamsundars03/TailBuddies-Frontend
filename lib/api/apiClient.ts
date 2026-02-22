// lib/api/apiClient.ts

import axios from 'axios';
import logger from '../logger';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookie handling
});

// Request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
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

// Response interceptor for logging
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
        return Promise.reject(error);
    }
);

export default apiClient;
