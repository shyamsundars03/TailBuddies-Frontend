import apiClient from './apiClient';
import { REVIEW_ENDPOINTS } from '../endpoints/review';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import type { Review } from '../types/owner/owner.types';

export const reviewApi = {
    create: async (data: { appointmentId: string, rating: number, comment?: string }): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.post(REVIEW_ENDPOINTS.CREATE, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to submit review');
        }
    },

    update: async (id: string, data: { rating?: number, comment?: string }): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.patch(REVIEW_ENDPOINTS.BY_ID(id), data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update review');
        }
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.delete(REVIEW_ENDPOINTS.BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to delete review');
        }
    },

    reply: async (id: string, comment: string): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.post(REVIEW_ENDPOINTS.REPLY(id), { comment });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to post reply');
        }
    },

    updateReply: async (id: string, comment: string): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.patch(REVIEW_ENDPOINTS.REPLY(id), { comment });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update reply');
        }
    },

    deleteReply: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.delete(REVIEW_ENDPOINTS.REPLY(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to delete reply');
        }
    },

    getDoctorReviews: async (page: number = 1, limit: number = 4, search: string = ''): Promise<ApiResponse<PaginatedResponse<Review>>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.DOCTOR_REVIEWS(page, limit, search));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch reviews');
        }
    },

    getOwnerReviews: async (page: number = 1, limit: number = 4, search: string = ''): Promise<ApiResponse<PaginatedResponse<Review>>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.OWNER_REVIEWS(page, limit, search));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch your reviews');
        }
    },

    getAllReviews: async (page: number = 1, limit: number = 4, search: string = ''): Promise<ApiResponse<PaginatedResponse<Review>>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.ALL_REVIEWS(page, limit, search));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch all reviews');
        }
    },

    getById: async (id: string): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch review');
        }
    },

    getByAppointment: async (appointmentId: string): Promise<ApiResponse<Review>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.BY_APPOINTMENT(appointmentId));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch appointment review');
        }
    },

    getByDoctorId: async (doctorId: string, page: number = 1, limit: number = 10, search: string = ''): Promise<ApiResponse<PaginatedResponse<Review>>> => {
        try {
            const response = await apiClient.get(REVIEW_ENDPOINTS.BY_DOCTOR_ID(doctorId, page, limit, search));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch doctor reviews');
        }
    }
};
