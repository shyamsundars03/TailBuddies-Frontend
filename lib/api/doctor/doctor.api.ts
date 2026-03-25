import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { DOCTOR_ENDPOINTS } from '@/lib/endpoints/doctor';

export const doctorApi = {








    async getAdminById(id: string) {
        try {
            // const response = await apiClient.get(`/admin/doctors/${id}`);
            const response = await apiClient.get(DOCTOR_ENDPOINTS.ADMIN_DOCTOR_BY_ID(id));
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
            // const response = await apiClient.get('/doctor/profile');
             const response = await apiClient.get(DOCTOR_ENDPOINTS.PROFILE);
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
            // const response = await apiClient.get(`/auth/doctors/${id}`);
            const response = await apiClient.get(DOCTOR_ENDPOINTS.AUTH_DOCTOR_BY_ID(id))
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
            // const response = await apiClient.put('/doctor/profile', data);
             const response = await apiClient.put(DOCTOR_ENDPOINTS.UPDATE_PROFILE, data);
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
            // const response = await apiClient.post('/doctor/upload-document', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            const response = await apiClient.post(DOCTOR_ENDPOINTS.UPLOAD_DOCUMENT, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
            // const response = await apiClient.post('/doctor/verification-request');
                  const response = await apiClient.post(DOCTOR_ENDPOINTS.VERIFICATION_REQUEST);

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
            // const response = await apiClient.get('/auth/specialties');
            const response = await apiClient.get(DOCTOR_ENDPOINTS.AUTH_SPECIALTIES);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch specialties' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },












    
    getAllDoctors: async (page = 1, limit = 9, search?: string, isVerified?: boolean, status?: string, filters?: any) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (isVerified !== undefined) params.append('isVerified', isVerified.toString());
            if (status) params.append('status', status);
            
            if (filters) {
                if (filters.specialty) params.append('specialty', filters.specialty);
                if (filters.gender) params.append('gender', filters.gender);
                if (filters.experienceYears) params.append('experienceYears', filters.experienceYears);
            }

            // Determine base URL: /admin/doctors for admin, /auth/doctors for public
            const url = status || isVerified === undefined ? `/admin/doctors?${params.toString()}` : `/auth/doctors?${params.toString()}`;
            
            const response = await apiClient.get(url);
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
            // const response = await apiClient.patch(`/admin/doctors/${doctorId}/verify`, data);
                  const response = await apiClient.patch(DOCTOR_ENDPOINTS.ADMIN_VERIFY(doctorId), data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Verification failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }














};
