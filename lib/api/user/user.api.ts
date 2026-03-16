import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { USER_ENDPOINTS } from '../../endpoints/user';
export const userApi = {





    getProfile: async () => {
        try {


            const response = await apiClient.get(USER_ENDPOINTS.PROFILE);
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


            const response = await apiClient.put(USER_ENDPOINTS.PROFILE, data);
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


            const response = await apiClient.patch(USER_ENDPOINTS.PROFILE_PIC, { profilePic });
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



            const response = await apiClient.post(USER_ENDPOINTS.CHANGE_EMAIL_INITIATE);
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



            const response = await apiClient.post(USER_ENDPOINTS.CHANGE_EMAIL_VERIFY_CURRENT, { otp });
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



            const response = await apiClient.post(USER_ENDPOINTS.CHANGE_EMAIL_SEND_OTP_NEW, { newEmail });
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



            const response = await apiClient.post(USER_ENDPOINTS.CHANGE_EMAIL_VERIFY_NEW, { newEmail, otp });
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


            const response = await apiClient.post(USER_ENDPOINTS.CHANGE_PASSWORD, data);
            return response.data;


            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Password change failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
