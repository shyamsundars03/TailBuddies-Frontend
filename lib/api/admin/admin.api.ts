import apiClient from '../apiClient';
import { AxiosError } from 'axios';
import { Specialty } from '../../../lib/types/admin/admin.types';

export const adminApi = {




    getSpecialties: async (page: number = 1, limit: number = 10, search?: string) => {
        try {


            const url = `/admin/specialties?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
            const response = await apiClient.get(url);
            return response.data;
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch specialties' };
            }
            throw error;
        }
    },







    addSpecialty: async (data: Omit<Specialty, 'id'>) => {
        try {
            const response = await apiClient.post('/admin/specialties', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to add specialty' };
            }
            throw error;
        }
    },







editSpecialty: async (id: string, data: Partial<Specialty>) => {
    try {


        const response = await apiClient.patch(`/admin/specialties/${id}`, data);
            return response.data;

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to edit specialty' };
        }
        throw error;
    }
},







    removeSpecialty: async (id: string) => {
        try {


            const response = await apiClient.delete(`/admin/specialties/${id}`);
            return response.data;

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to delete specialty' };
            }
            throw error;
        }
    },






    getUsers: async (page: number = 1, limit: number = 10, role?: string, search?: string) => {
        try {



            const url = `/admin/users?page=${page}&limit=${limit}${role && role !== 'all' ? `&role=${role}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
            const response = await apiClient.get(url);
            return response.data;



        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
            }
            throw error;
        }
    },







    toggleUserBlock: async (id: string) => {
        try {


            const response = await apiClient.patch(`/admin/users/${id}/block`);
            return response.data;



        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to update user status' };
            }
            throw error;
        }
    }
};
