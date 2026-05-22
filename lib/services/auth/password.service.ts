import { passwordApi } from '../../api/auth';
import { ForgotPasswordParams, AuthApiResponse, ResetPasswordParams } from '../../types/auth/auth.types';

export const passwordService = {
    forgot: async (params: ForgotPasswordParams): Promise<AuthApiResponse> => {
        return await passwordApi.forgot(params);
    },

    reset: async (params: ResetPasswordParams): Promise<AuthApiResponse> => {
        return await passwordApi.reset(params);
    },
};
