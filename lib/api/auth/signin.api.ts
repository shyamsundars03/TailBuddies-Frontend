

import apiClient from '../apiClient';
import logger from '../../logger';
import { AxiosError } from 'axios';
import { SigninCredentials, AuthApiResponse } from '../../types/auth';

export const signinApi = {





    login: async (credentials: SigninCredentials): Promise<AuthApiResponse> => {

        try {
            logger.info('Signin API call', { email: credentials.email });
            const response = await apiClient.post('/auth/signin', credentials);


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
                logger.error('Signin API error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return {
                    success: false,
                    error: error.response?.data?.message || error.message || 'Login failed',
                };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

















};
