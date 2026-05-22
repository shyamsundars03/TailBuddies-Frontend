
import apiClient from '../apiClient';
import { LoginParams, AuthApiResponse } from '../../types/auth/auth.types';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
import { handleApiError } from '../../utils/api-error.handler';
import { ApiResponse } from '../../types/api.types';

export const signinApi = {
    login: async (credentials: LoginParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.SIGNIN, credentials);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    },

    logout: async (): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    },
};
