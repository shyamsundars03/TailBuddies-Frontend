import apiClient from '../apiClient';
import { ADMIN_ENDPOINTS } from '../../endpoints/admin';
import { ApiResponse, PaginatedResponse } from '../../types/api.types';
import { Pet, GetSpecialtiesParams as GetPetsParams } from '../../types/admin/admin.types';
import { handleApiError } from '../../utils/api-error.handler';

export const adminPetApi = {
    getAllPets: async (params: GetPetsParams): Promise<ApiResponse<PaginatedResponse<Pet>>> => {
        try {
            const { page = 1, limit = 10, search } = params;
            const response = await apiClient.get(ADMIN_ENDPOINTS.PETS_LIST(page, limit, search));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch pets');
        }
    },

    getPetById: async (id: string): Promise<ApiResponse<Pet>> => {
        try {
            const response = await apiClient.get(ADMIN_ENDPOINTS.PET_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch pet details');
        }
    }
};
