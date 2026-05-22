import apiClient from '../apiClient';
import { GoogleLoginParams, AuthApiResponse } from '../../types/auth/auth.types';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
import { handleApiError } from '../../utils/api-error.handler';

export const googleAuthApi = {
    login: async (params: GoogleLoginParams): Promise<AuthApiResponse> => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, params);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error);
        }
    },
};
