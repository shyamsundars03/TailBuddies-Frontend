import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const appointmentApi = {






    create: async (data: any) => {
        try {
            const response = await apiClient.post('/appointments', data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to book appointment' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },









    getOwnerAppointments: async (page = 1, limit = 10, search = "", status = "") => {
        try {
            let url = `/appointments?page=${page}&limit=${limit}&search=${search}`;
            if (status) url += `&status=${status}`;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch appointments' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
 





    getAll: async (page = 1, limit = 10, search = "") => {
        try {
            const response = await apiClient.get(`/appointments/all?page=${page}&limit=${limit}&search=${search}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch all appointments' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },
 











    getDoctorAppointments: async (status?: string, page = 1, limit = 10, search = "") => {
        try {
            let url = `/appointments/doctor?page=${page}&limit=${limit}&search=${search}`;
            if (status) url += `&status=${status}`;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch appointments' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },

    getDoctorPatients: async (page = 1, limit = 10, search = "") => {
        try {
            const response = await apiClient.get(`/appointments/doctor/patients?page=${page}&limit=${limit}&search=${search}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch patients' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },










    getAppointmentById: async (id: string) => {
        try {
            const response = await apiClient.get(`/appointments/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch appointment' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },










    updateStatus: async (id: string, status: string, reason?: string) => {
        try {
            const response = await apiClient.patch(`/appointments/${id}/status`, { status, reason });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to update status' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },









    cancel: async (id: string, reason: string) => {
        try {
            const response = await apiClient.post(`/appointments/${id}/cancel`, { reason });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to cancel appointment' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },












    getAvailableSlots: async (doctorId: string, date: string) => {
        try {
            const response = await apiClient.get(`/appointments/slots?doctorId=${doctorId}&date=${date}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Failed to fetch slots' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },











    checkIn: async (id: string, role: 'owner' | 'doctor') => {
        try {
            const response = await apiClient.post(`/appointments/${id}/check-in`, { role });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Check-in failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    },










    checkOut: async (id: string, role: 'owner' | 'doctor') => {
        try {
            const response = await apiClient.post(`/appointments/${id}/check-out`, { role });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, error: error.response?.data?.message || 'Check-out failed' };
            }
            return { success: false, error: 'An unknown error occurred' };
        }
    }











    
};
