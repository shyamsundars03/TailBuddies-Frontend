import apiClient from '../apiClient';
import { ADMIN_ENDPOINTS } from '../../endpoints/admin';
import { ApiResponse, PaginatedResponse } from '../../types/api.types';
import { Appointment, GetAppointmentsParams } from '../../types/admin/admin.types';
import { handleApiError } from '../../utils/api-error.handler';

export const adminAppointmentApi = {
    getAllAppointments: async (params: GetAppointmentsParams): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
        try {
            const { page = 1, limit = 10, search = "", status = "" } = params;
            const apiParams = { page, limit, search, status };
            const response = await apiClient.get(ADMIN_ENDPOINTS.APPOINTMENTS_ALL, { params: apiParams });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch all appointments');
        }
    },

    getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
        try {
            const response = await apiClient.get(ADMIN_ENDPOINTS.APPOINTMENT_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch appointment');
        }
    }
};
