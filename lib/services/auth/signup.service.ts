

import { signupApi } from '../../api/auth/signup.api';
import { SignupDTO } from '../../dto/auth/signup.dto';
import type { SignupFormData, SignupApiResponse } from '../../types/auth/signup.types';
import logger from '../../logger/index';

export const signupService = {



register: async (formData: SignupFormData): Promise<SignupApiResponse> => {
    try {
      
      const apiData = SignupDTO.toApi(formData);

      logger.info('Signup service: sending data', { email: apiData.email });

      const response = await signupApi.register(apiData);

      if (response.success) {
        logger.info('Signup service: success', { email: apiData.email });
      } else {
        logger.warn('Signup service: failed', { email: apiData.email, error: response.error });
      }

      return response;

    } catch (error) {
      logger.error('Signup service error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }






    
  },




};