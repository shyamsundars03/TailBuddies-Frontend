import apiClient from '../apiClient';
import { AxiosError } from 'axios';

export const doctorApi = {
    async getAdminById(id: string) {
        try {
            const response = await apiClient.get(`/admin/doctors/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch doctor' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    getProfile: async () => {
        try {
            const response = await apiClient.get('/doctor/profile');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch doctor profile' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/doctor/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch doctor' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    updateProfile: async (data: Record<string, any>) => {
        try {
            const response = await apiClient.put('/doctor/profile', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    uploadDocument: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('document', file);
            const response = await apiClient.post('/doctor/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Upload failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    requestVerification: async () => {
        try {
            const response = await apiClient.post('/doctor/verification-request');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Verification request failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
    
    getSpecialties: async () => {
        try {
            const response = await apiClient.get('/auth/specialties');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch specialties' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    // Admin endpoints
    getAllDoctors: async (page = 1, limit = 10, search?: string, isVerified?: boolean, status?: string) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (isVerified !== undefined) params.append('isVerified', isVerified.toString());
            if (status) params.append('status', status);

            const response = await apiClient.get(`/admin/doctors?${params.toString()}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch doctors' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    verifyDoctor: async (doctorId: string, data: { isVerified: boolean, rejectionReason?: string, verificationStatus?: Record<string, boolean> }) => {
        try {
            const response = await apiClient.patch(`/admin/doctors/${doctorId}/verify`, data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Verification failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
