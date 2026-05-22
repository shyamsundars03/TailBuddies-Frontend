import apiClient from '../apiClient';
import { DOCTOR_ENDPOINTS } from '@/lib/endpoints/doctor';
import { ApiResponse } from '@/lib/types/api.types';
import type { DoctorDetail } from '@/lib/types/admin/admin.types';
import type { DoctorFilters, DoctorResponse, PaginatedDoctorResponse  } from '@/lib/types/doctor/doctor.api.types';
import { handleApiError } from '../../utils/api-error.handler';

export type { DoctorFilters, DoctorResponse, PaginatedDoctorResponse };

export interface DoctorUploadResponse {
    url?: string;
    filename?: string;
}

export const doctorApi = {
    getAdminById: async (id: string): Promise<ApiResponse<DoctorDetail>> => {
        try {
            const response = await apiClient.get(DOCTOR_ENDPOINTS.ADMIN_DOCTOR_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch doctor');
        }
    },

    getProfile: async (): Promise<ApiResponse<DoctorDetail>> => {
        try {
            const response = await apiClient.get(DOCTOR_ENDPOINTS.PROFILE);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch doctor profile');
        }
    },

    getById: async (id: string): Promise<ApiResponse<DoctorResponse>> => {
        try {
            const response = await apiClient.get(DOCTOR_ENDPOINTS.AUTH_DOCTOR_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch doctor');
        }
    },

// getownerCount: async (docId:string) : Promise<ApiResponse<Owners>> =>{


// try{



// }catch(){




// }

// }



    updateProfile: async (data: Record<string, unknown>): Promise<ApiResponse<DoctorDetail>> => {
        try {
            const response = await apiClient.put(DOCTOR_ENDPOINTS.UPDATE_PROFILE, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Update failed');
        }
    },

    uploadDocument: async (file: File): Promise<ApiResponse<DoctorUploadResponse>> => {
        try {
            const formData = new FormData();
            formData.append('document', file);
            const response = await apiClient.post(DOCTOR_ENDPOINTS.UPLOAD_DOCUMENT, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Upload failed');
        }
    },

    requestVerification: async (): Promise<ApiResponse<Record<string, unknown>>> => {
        try {
            const response = await apiClient.post(DOCTOR_ENDPOINTS.VERIFICATION_REQUEST);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Verification request failed');
        }
    },

    getSpecialties: async (): Promise<ApiResponse<Record<string, unknown>[]>> => {
        try {
            const response = await apiClient.get(DOCTOR_ENDPOINTS.AUTH_SPECIALTIES);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch specialties');
        }
    },

    getAllDoctors: async (
        page = 1,
        limit = 3,
        search?: string,
        isVerified?: boolean,
        status?: string,
        filters?: DoctorFilters,
        _sortBy?: string
    ): Promise<PaginatedDoctorResponse> => {
        try {
            const url = DOCTOR_ENDPOINTS.DOCTORS_LIST(page, limit, search, isVerified, status, filters, _sortBy);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            const fallback = handleApiError(error, 'Failed to fetch doctors');
            return {
                success: false,
                data: { items: [], total: 0, page, limit },
                message: fallback.message,
                error: fallback.error,
            };
        }
    },

    verifyDoctor: async (
        doctorId: string,
        data: { isVerified?: boolean; rejectionReason?: string; verificationStatus?: Record<string, boolean> }
    ): Promise<ApiResponse<Record<string, unknown>>> => {
        try {
            const response = await apiClient.patch(DOCTOR_ENDPOINTS.ADMIN_VERIFY(doctorId), data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Verification failed');
        }
    },
};
