

import { passwordApi } from '../../api/auth';
import logger from '../../logger';
import { AuthApiResponse } from '../../types/auth';

export const passwordService = {




forgot: async (email: string): Promise<AuthApiResponse> => {


        logger.info('passwordService.forgot called', { email });
        return await passwordApi.forgot(email);
},


    reset: async (data: unknown): Promise<AuthApiResponse> => {

        logger.info('passwordService.reset called');
        return await passwordApi.reset(data);

    },

};
