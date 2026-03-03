import apiClient from '../apiClient';
import { AxiosError } from 'axios';

export const userApi = {





    getProfile: async () => {
        try {


            const response = await apiClient.get('/user/profile');
            return response.data;


        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch profile' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    updateProfile: async (data: Record<string, unknown>) => {
        try {


            const response = await apiClient.put('/user/profile', data);
            return response.data;



        } catch (error: unknown) {


            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    updateProfilePic: async (profilePic: string) => {

        try {


            const response = await apiClient.patch('/user/profile-pic', { profilePic });
            return response.data;

            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    initiateEmailChange: async () => {
        try {



            const response = await apiClient.post('/user/change-email/initiate');
            return response.data;



        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Initiation failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    verifyCurrentEmail: async (otp: string) => {
        try {



            const response = await apiClient.post('/user/change-email/verify-current', { otp });
            return response.data;




        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Verification failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },















    sendOtpToNewEmail: async (newEmail: string) => {
        try {



            const response = await apiClient.post('/user/change-email/send-otp-new', { newEmail });
            return response.data;




        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to send OTP' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    verifyNewEmail: async (newEmail: string, otp: string) => {
        try {



            const response = await apiClient.post('/user/change-email/verify-new', { newEmail, otp });
            return response.data;



        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Verification failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },









    changePassword: async (data: Record<string, unknown>) => {
        try {


            const response = await apiClient.post('/user/change-password', data);
            return response.data;


            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Password change failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
