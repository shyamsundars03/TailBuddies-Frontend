
import apiClient from '../apiClient';
import { VerifyOtpParams, AuthApiResponse, ResendOtpParams } from '../../types/auth/auth.types';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
import { handleApiError } from '../../utils/api-error.handler';

export const otpApi = {
    verify: async (params: VerifyOtpParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_OTP, params);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    },

    resend: async (params: ResendOtpParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.RESEND_OTP, params);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
};
