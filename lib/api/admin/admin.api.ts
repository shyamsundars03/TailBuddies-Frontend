import apiClient from '../apiClient';
import { Specialty, GetSpecialtiesParams, GetUsersParams, UserManagementResponse } from '../../../lib/types/admin/admin.types';
import { ADMIN_ENDPOINTS } from '../../endpoints/admin';
import { ApiResponse, PaginatedResponse } from '../../types/api.types';
import { handleApiError } from '../../utils/api-error.handler';

export const adminApi = {
    getSpecialties: async (params: GetSpecialtiesParams): Promise<ApiResponse<PaginatedResponse<Specialty>>> => {
        try {
            const { page = 1, limit = 10, search } = params;
            const url = ADMIN_ENDPOINTS.SPECIALTIES_LIST(page, limit, search);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch specialties');
        }
    },

    addSpecialty: async (data: Omit<Specialty, 'id'>): Promise<ApiResponse<Specialty>> => {
        try {
            const response = await apiClient.post(ADMIN_ENDPOINTS.SPECIALTIES, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to add specialty');
        }
    },

    editSpecialty: async (id: string, data: Partial<Specialty>): Promise<ApiResponse<Specialty>> => {
        try {
            const response = await apiClient.patch(ADMIN_ENDPOINTS.SPECIALTY_BY_ID(id), data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to edit specialty');
        }
    },

    removeSpecialty: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.delete(ADMIN_ENDPOINTS.SPECIALTY_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to delete specialty');
        }
    },

    getUsers: async (params: GetUsersParams): Promise<ApiResponse<UserManagementResponse>> => {
        try {
            const { page = 1, limit = 10, role, search } = params;
            const url = ADMIN_ENDPOINTS.USERS_LIST(page, limit, role, search);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch users');
        }
    },

    toggleUserBlock: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.patch(ADMIN_ENDPOINTS.TOGGLE_USER_BLOCK(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update user status');
        }
    }
};
