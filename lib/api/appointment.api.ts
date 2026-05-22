import apiClient from './apiClient';
import { APPOINTMENT_ENDPOINTS } from '../endpoints/appointment';
import { handleApiError } from '../utils/api-error.handler';
import {
    ApiResponse,
    PaginatedResponse,
    DoctorAppointmentStats,
    SlotAvailabilityData,
    AgoraTokenData,
    AvailableSlot,
} from '../types/api.types';
import type { OwnerAppointment, OwnerAppointmentStats } from '../types/owner/owner.types';
import type { Appointment } from '../types/admin/admin.types';

export const appointmentApi = {
    create: async (data: unknown): Promise<ApiResponse<OwnerAppointment>> => {
        try {
            const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CREATE, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to book appointment');
        }
    },

    getOwnerAppointments: async (
        page = 1,
        limit = 10,
        search = "",
        status = "",
        timeframe = "",
        pet = ""
    ): Promise<ApiResponse<PaginatedResponse<OwnerAppointment>>> => {
        try {
            const url = APPOINTMENT_ENDPOINTS.OWNER_APPOINTMENTS(page, limit, search, status, timeframe, pet);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch appointments');
        }
    },

    getAll: async (page = 1, limit = 10, search = "", status = ""): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
        try {
            const url = APPOINTMENT_ENDPOINTS.ALL_APPOINTMENTS(page, limit, search, status);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch all appointments');
        }
    },

    getDoctorAppointments: async (
        status?: string,
        page = 1,
        limit = 10,
        search = ""
    ): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
        try {
            const url = APPOINTMENT_ENDPOINTS.DOCTOR_APPOINTMENTS(status, page, limit, search);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch appointments');
        }
    },

    getDoctorPatients: async (
        page = 1,
        limit = 10,
        search = "",
        species = "",
        date = ""
    ): Promise<ApiResponse<PaginatedResponse<Record<string, unknown>>>> => {
        try {
            const url = APPOINTMENT_ENDPOINTS.DOCTOR_PATIENTS(page, limit, search, species, date);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch patients');
        }
    },

    getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch appointment');
        }
    },

    updateStatus: async (id: string, status: string, reason?: string): Promise<ApiResponse<Appointment>> => {
        try {
            const response = await apiClient.patch(APPOINTMENT_ENDPOINTS.UPDATE_STATUS(id), { status, reason });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update status');
        }
    },

    cancel: async (id: string, reason: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CANCEL(id), { reason });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to cancel appointment');
        }
    },

    getAvailableSlots: async (doctorId: string, date: string): Promise<ApiResponse<AvailableSlot[]>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.SLOTS(doctorId, date));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch slots');
        }
    },

    checkIn: async (id: string, role: 'owner' | 'doctor'): Promise<ApiResponse<Appointment>> => {
        try {
            const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CHECK_IN(id), { role });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Check-in failed');
        }
    },

    checkOut: async (id: string, role: 'owner' | 'doctor'): Promise<ApiResponse<Appointment>> => {
        try {
            const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CHECK_OUT(id), { role });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Check-out failed');
        }
    },

    getDoctorStats: async (): Promise<ApiResponse<DoctorAppointmentStats>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.DOCTOR_STATS);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch statistics');
        }
    },

    getOwnerStats: async (): Promise<ApiResponse<OwnerAppointmentStats>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.OWNER_STATS);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch statistics');
        }
    },

    cancelPendingAppointment: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CANCEL_PENDING(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to cancel appointment');
        }
    },

    checkSlotAvailability: async (id: string): Promise<ApiResponse<SlotAvailabilityData>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.CHECK_SLOT(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to check slot availability');
        }
    },

    getAgoraToken: async (
        channelName: string,
        uid?: string | number,
        role?: 'publisher' | 'subscriber'
    ): Promise<ApiResponse<AgoraTokenData>> => {
        try {
            const url = APPOINTMENT_ENDPOINTS.AGORA_TOKEN(channelName, uid, role);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch Agora token');
        }
    },

    getDoctorSlots: async (date: string): Promise<ApiResponse<AvailableSlot[]>> => {
        try {
            const response = await apiClient.get(APPOINTMENT_ENDPOINTS.DOCTOR_SLOTS(date));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch doctor slots');
        }
    }
};
