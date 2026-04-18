import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const prescriptionApi = {
    create: async (data: any) => {
        try {
            const response = await apiClient.post('/prescriptions', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to create prescription' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getByAppointmentId: async (appointmentId: string) => {
        try {
            const response = await apiClient.get(`/prescriptions/appointment/${appointmentId}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch prescription' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/prescriptions/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch prescription' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    downloadPdf: async (id: string) => {
        try {
            const response = await apiClient.get(`/prescriptions/${id}/download`, {
                responseType: 'blob'
            });
            
            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to download prescription' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
