// lib/services/auth/password.service.ts

import { passwordApi } from '../../api/auth';
import logger from '../../logger';

export const passwordService = {
    forgot: async (email: string): Promise<any> => {
        logger.info('passwordService.forgot called', { email });
        return await passwordApi.forgot(email);
    },
    reset: async (data: any): Promise<any> => {
        logger.info('passwordService.reset called');
        return await passwordApi.reset(data);
    }
};
