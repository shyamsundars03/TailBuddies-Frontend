import apiClient from '../apiClient';
import { ForgotPasswordParams, AuthApiResponse, ResetPasswordParams } from '../../types/auth/auth.types';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
import { handleApiError } from '../../utils/api-error.handler';

export const passwordApi = {
    forgot: async (params: ForgotPasswordParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, params);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    },

    reset: async (params: ResetPasswordParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, params);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
};
