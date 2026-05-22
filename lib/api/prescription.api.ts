import apiClient from './apiClient';
import { PRESCRIPTION_ENDPOINTS } from '../endpoints/prescription';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse, Prescription } from '../types/api.types';
import { AxiosError } from 'axios';

export const prescriptionApi = {
    create: async (data: unknown): Promise<ApiResponse<Prescription>> => {
        try {
            const response = await apiClient.post(PRESCRIPTION_ENDPOINTS.CREATE, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to create prescription');
        }
    },

    getByAppointmentId: async (appointmentId: string): Promise<ApiResponse<Prescription>> => {
        try {
            const response = await apiClient.get(PRESCRIPTION_ENDPOINTS.BY_APPOINTMENT_ID(appointmentId), {
                validateStatus: (status) => status === 200 || status === 404,
                skipErrorLog: true,
            } as Parameters<typeof apiClient.get>[1]);
            if (response.status === 404) {
                return { success: false, message: 'Prescription not found' };
            }
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch prescription');
        }
    },

    getById: async (id: string): Promise<ApiResponse<Prescription>> => {
        try {
            const response = await apiClient.get(PRESCRIPTION_ENDPOINTS.BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch prescription');
        }
    },

    downloadPdf: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.get(PRESCRIPTION_ENDPOINTS.DOWNLOAD_PDF(id), {
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
            }
            return handleApiError(error, 'Failed to download prescription');
        }
    }
};
