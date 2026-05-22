import apiClient from '../apiClient';
import { ADMIN_ENDPOINTS } from '../../endpoints/admin';
import { ApiResponse } from '../../types/api.types';
import { DashboardStats, ReportItem, SpecialtyStat } from '../../types/admin/admin.types';
import { handleApiError } from '../../utils/api-error.handler';

export interface AdminReportsResponse {
  reports: ReportItem[];
  total: number;
}

export const adminAnalyticsApi = {
    getDashboardStats: async (filters: { from?: string; to?: string; grouping?: string } = {}): Promise<ApiResponse<DashboardStats>> => {
        try {
            const response = await apiClient.get(ADMIN_ENDPOINTS.DASHBOARD_STATS, { params: filters });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch dashboard stats');
        }
    },

    getReports: async (filters: { from?: string; to?: string; specialtyId?: string; search?: string; page?: number; limit?: number }): Promise<ApiResponse<AdminReportsResponse>> => {
        try {
            const response = await apiClient.get(ADMIN_ENDPOINTS.REPORTS, { params: filters });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch reports');
        }
    },

    getSpecialtyStats: async (filters: { from?: string; to?: string }): Promise<ApiResponse<{ stats: SpecialtyStat[] }>> => {
        try {
            const response = await apiClient.get(ADMIN_ENDPOINTS.SPECIALTY_STATS, { params: filters });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch specialty stats');
        }
    }
};
