// lib/api/auth/password.api.ts

import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';

export const passwordApi = {
    forgot: async (email: string): Promise<any> => {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Request failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
    reset: async (data: any): Promise<any> => {
        try {
            const response = await apiClient.post('/auth/reset-password', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Reset failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
