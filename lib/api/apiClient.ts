

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
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        logger.debug('API Response', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        logger.error('API Response Error', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });

        // Handle account blocked in real-time
        if (error.response?.status === 403 && error.response?.data?.message === 'Account is blocked') {
            // toast.error('Account Blocked');

            localStorage.removeItem('user');
            clientCookies.delete('token');
            if (window.location.pathname !== '/signin') {
                window.location.href = '/signin';
            }
            
            return Promise.reject(error);
        }

        // Handle token expiration
        const isAuthRoute = originalRequest.url?.includes('/auth/signin') ||
            originalRequest.url?.includes('/auth/verify-otp') ||
            originalRequest.url?.includes('/auth/google-login');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                logger.info(`Session expired (401). Attempting to refresh token for ${originalRequest.url}`);
                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data.data;
                logger.info('Token refreshed successfully');
                
                // Save new token to cookie
                clientCookies.set('token', accessToken, 7 * 24 * 60 * 60); // 7 days

                // Update default authorization header for future requests
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                
                processQueue(null, accessToken);
                
                // Update original request header and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError: any) {
                logger.error('Token refresh failed', refreshError);
                processQueue(refreshError, null);
                clientCookies.delete('token');
                localStorage.removeItem('user');
                
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
                    // Use replace to avoid back-button loops
                    window.location.replace('/signin?error=session_expired');
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
