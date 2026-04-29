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
            
            // Check if it's actually JSON (error)
            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const errorData = JSON.parse(text);
                return { success: false, message: errorData.message || 'Failed to download prescription' };
            }

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
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
                if (error.response?.data instanceof Blob) {
                    const text = await error.response.data.text();
                    try {
                        const errorData = JSON.parse(text);
                        return { success: false, message: errorData.message || 'Failed to download prescription' };
                    } catch {
                        return { success: false, message: 'Failed to download prescription' };
                    }
                }
                return { success: false, message: error.response?.data?.message || 'Failed to download prescription' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
