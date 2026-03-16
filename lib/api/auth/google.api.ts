
import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';
import { AuthApiResponse } from '../../types/auth';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
export const googleAuthApi = {





    login: async (idToken: string, role: string): Promise<AuthApiResponse> => {

        try {



            logger.info('Google Auth API call', { role });
            const response = await apiClient.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, { idToken, role });

            if (response.data?.success && response.data?.data) {
                const { user: apiUser, accessToken } = response.data.data;
                return {
                    success: true,
                    message: response.data.message,
                    data: {
                        user: {
                            id: apiUser.id,
                            email: apiUser.email,
                            role: apiUser.role,
                            userName: apiUser.userName,
                        },
                        accessToken: accessToken,
                    }
                };
            }
            return response.data;




        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                logger.error('Google Auth API error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return {
                    success: false,
                    error: error.response?.data?.message || error.message || 'Google Login failed',
                };
            }

            
            return { success: false, error: 'An unknown error occurred' };
        }
    },
};
