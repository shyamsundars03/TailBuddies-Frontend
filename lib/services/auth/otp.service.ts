

import { otpApi } from '../../api/auth';
import logger from '../../logger';
import { AuthApiResponse } from '../../types/auth';

export const otpService = {



    verify: async (data: { email: string; otp: string; userData?: unknown }): Promise<AuthApiResponse> => {

        logger.info('otpService.verify called', { email: data.email });

        return await otpApi.verify(data);
    },



    resend: async (email: string): Promise<AuthApiResponse> => {

        logger.info('otpService.resend called', { email });
        
        return await otpApi.resend(email);
    },



};
