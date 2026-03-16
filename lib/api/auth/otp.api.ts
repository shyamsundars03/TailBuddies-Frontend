

import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';
import { AuthApiResponse } from '../../types/auth';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
export const otpApi = {



    verify: async (data: { email: string; otp: string; userData?: unknown; purpose?: string }): Promise<AuthApiResponse> => {

        try {
            logger.info('OTP Verification API call', { email: data.email, purpose: data.purpose });
            const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_OTP, data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                logger.error('OTP Verification API error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return {
                    success: false,
                    error: error.response?.data?.message || 'Verification failed',
                };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
















    resend: async (email: string): Promise<AuthApiResponse> => {

        try {
            const response = await apiClient.post('/auth/resend-otp', { email });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Resend failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }








};
