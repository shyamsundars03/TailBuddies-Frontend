// lib/services/auth/otp.service.ts

import { otpApi } from '../../api/auth';
import logger from '../../logger';

export const otpService = {
    verify: async (data: { email: string; otp: string }): Promise<any> => {
        logger.info('otpService.verify called', { email: data.email });
        return await otpApi.verify(data);
    },
    resend: async (email: string): Promise<any> => {
        logger.info('otpService.resend called', { email });
        return await otpApi.resend(email);
    }
};
