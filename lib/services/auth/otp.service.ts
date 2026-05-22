import { otpApi } from '../../api/auth';
import { VerifyOtpParams, AuthApiResponse, ResendOtpParams } from '../../types/auth/auth.types';

export const otpService = {
    verify: async (params: VerifyOtpParams): Promise<AuthApiResponse> => {
        return await otpApi.verify(params);
    },

    resend: async (params: ResendOtpParams): Promise<AuthApiResponse> => {
        return await otpApi.resend(params);
    },
};
