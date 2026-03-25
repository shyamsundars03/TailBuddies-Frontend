import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { PET_ENDPOINTS } from '../../endpoints/pet';

export const userPetApi = {








    addPet: async (data: FormData | Record<string, any>) => {
        try {
            const response = await apiClient.post(PET_ENDPOINTS.OWNER_ADD_PET, data, {
                headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to add pet' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },












    getOwnerPets: async (page: number = 1, limit: number = 5, search: string = "") => {
        try {
            const response = await apiClient.get(`${PET_ENDPOINTS.OWNER_GET_PETS}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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
            const response = await apiClient.get(PET_ENDPOINTS.OWNER_GET_PET_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch pet details' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },












    updatePet: async (id: string, data: FormData | Record<string, any>) => {
        try {
            const response = await apiClient.put(PET_ENDPOINTS.OWNER_UPDATE_PET(id), data, {
                headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to update pet' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },








    togglePetStatus: async (id: string, isActive: boolean) => {
        try {
            const response = await apiClient.patch(PET_ENDPOINTS.OWNER_TOGGLE_STATUS(id), { isActive });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to change pet status' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },






    
    deletePet: async (id: string) => {
        try {
            const response = await apiClient.delete(PET_ENDPOINTS.OWNER_DELETE_PET(id));
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to delete pet' };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
};
