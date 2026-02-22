// lib/api/auth/signin.api.ts

import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';

export const signinApi = {
    login: async (credentials: any): Promise<any> => {
        try {
            logger.info('Signin API call', { email: credentials.email });
            const response = await apiClient.post('/auth/signin', credentials);

            // Transform backend response to match frontend expectation
            if (response.data?.success && response.data?.data) {
                const apiData = response.data.data;
                return {
                    success: true,
                    message: response.data.message,
                    data: {
                        user: {
                            id: apiData.id,
                            email: apiData.email,
                            role: apiData.role,
                            username: apiData.userName, // Map userName to username
                        },
                        token: apiData.accessToken, // Map accessToken to token
                    }
                };
            }
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                logger.error('Signin API error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return {
                    success: false,
                    error: error.response?.data?.message || error.message || 'Login failed',
                };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
};
