import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const adminAnalyticsApi = {
    getDashboardStats: async () => {
        try {
            const response = await apiClient.get('/admin/dashboard-stats');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch dashboard stats' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getReports: async (filters: { from?: string; to?: string; specialtyId?: string; search?: string }) => {
        try {
            const params = new URLSearchParams();
            if (filters.from) params.append('from', filters.from);
            if (filters.to) params.append('to', filters.to);
            if (filters.specialtyId) params.append('specialtyId', filters.specialtyId);
            if (filters.search) params.append('search', filters.search);

            const queryString = params.toString();
            const response = await apiClient.get(`/admin/reports${queryString ? `?${queryString}` : ''}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch reports' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getSpecialtyStats: async (filters: { from?: string; to?: string }) => {
        try {
            const params = new URLSearchParams();
            if (filters.from) params.append('from', filters.from);
            if (filters.to) params.append('to', filters.to);

            const queryString = params.toString();
            const response = await apiClient.get(`/admin/specialty-stats${queryString ? `?${queryString}` : ''}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch specialty stats' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
