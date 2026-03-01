import type { SignupApiRequest, SignupApiResponse } from '../../types/auth/signup.types';
import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';

export const signupApi = {



  register: async (data: SignupApiRequest): Promise<SignupApiResponse> => {
    try {
              logger.info('Signup API call', { email: data.email });

      const response = await apiClient.post('/auth/signup', data);
      return response.data;

    } catch (error: unknown) {
      
      if (error instanceof AxiosError) {
              logger.error('Signup API error', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        return {
          success: false,
          error: error.response?.data?.message || error.message || 'Signup failed',
        };
      }

  
      if (error instanceof Error) {
                logger.error('Signup API error', error);
        return {
          success: false,
          error: error.message,
        };
      }

    
      logger.error('Signup API unknown error', error);
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  },





};