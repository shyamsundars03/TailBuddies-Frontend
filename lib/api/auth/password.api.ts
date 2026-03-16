
import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { AuthApiResponse } from '../../types/auth';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
export const passwordApi = {




    forgot: async (email: string): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Request failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },









    
    reset: async (data: unknown): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Reset failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
