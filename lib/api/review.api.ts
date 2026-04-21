import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const reviewApi = {
    create: async (data: { appointmentId: string, rating: number, comment?: string }) => {
        try {
            const response = await apiClient.post('/reviews', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to submit review' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    update: async (id: string, data: { rating?: number, comment?: string }) => {
        try {
            const response = await apiClient.patch(`/reviews/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to update review' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    delete: async (id: string) => {
        try {
            const response = await apiClient.delete(`/reviews/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to delete review' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    reply: async (id: string, comment: string) => {
        try {
            const response = await apiClient.post(`/reviews/${id}/reply`, { comment });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to post reply' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    updateReply: async (id: string, comment: string) => {
        try {
            const response = await apiClient.patch(`/reviews/${id}/reply`, { comment });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to update reply' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    deleteReply: async (id: string) => {
        try {
            const response = await apiClient.delete(`/reviews/${id}/reply`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to delete reply' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getDoctorReviews: async () => {
        try {
            const response = await apiClient.get('/reviews/doctor/me');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch reviews' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getOwnerReviews: async () => {
        try {
            const response = await apiClient.get('/reviews/owner/me');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch your reviews' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getAllReviews: async () => {
        try {
            const response = await apiClient.get('/reviews/all');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch all reviews' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/reviews/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch review' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getByAppointment: async (appointmentId: string) => {
        try {
            const response = await apiClient.get(`/reviews/appointment/${appointmentId}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch appointment review' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
