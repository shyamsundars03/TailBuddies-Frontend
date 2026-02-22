// lib/services/auth/signin.service.ts

import { signinApi } from '../../api/auth';
import logger from '../../logger';

export const signinService = {
    login: async (credentials: any): Promise<any> => {
        logger.info('signinService.login called', { email: credentials.email });
        // This will call the actual API once backend is ready
        // For now, we interact with the mock logic if needed, 
        // but the instruction is to move towards the architecture
        return await signinApi.login(credentials);
    },
};
