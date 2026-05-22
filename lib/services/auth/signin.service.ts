import { signinApi, googleAuthApi } from '../../api/auth';
import { LoginParams, AuthApiResponse, GoogleLoginParams } from '../../types/auth/auth.types';
import { mapAuthUser } from './auth.mapper';
import { ApiResponse } from '../../types/api.types';

export const signinService = {
    login: async (credentials: LoginParams): Promise<AuthApiResponse> => {
        const response = await signinApi.login(credentials);
        if (response.success && response.data?.user) {
            response.data.user = mapAuthUser(response.data.user);
        }
        return response;
    },

    googleLogin: async (params: GoogleLoginParams): Promise<AuthApiResponse> => {
        const response = await googleAuthApi.login(params);
        if (response.success && response.data?.user) {
            response.data.user = mapAuthUser(response.data.user);
        }
        return response;
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return await signinApi.logout();
    },
};
