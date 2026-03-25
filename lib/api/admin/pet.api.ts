import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { PET_ENDPOINTS } from '../../endpoints/pet';

export const adminPetApi = {



    getAllPets: async (page = 1, limit = 10, search?: string) => {
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (search) {
                params.append('search', search);
            }
            const response = await apiClient.get(`${PET_ENDPOINTS.ADMIN_GET_ALL_PETS}?${params.toString()}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch pets' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },


    
    getPetById: async (id: string) => {
        try {
            const response = await apiClient.get(PET_ENDPOINTS.ADMIN_GET_PET_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch pet details' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }
};
