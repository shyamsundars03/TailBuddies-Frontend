import apiClient from './apiClient';
import { NOTIFICATION_ENDPOINTS } from '../endpoints/notification';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse, NotificationItem } from '../types/api.types';

export const notificationApi = {
    getNotifications: async (status?: string): Promise<ApiResponse<NotificationItem[]>> => {
        try {
            const response = await apiClient.get(NOTIFICATION_ENDPOINTS.LIST(status));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch notifications');
        }
    },

    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_AS_READ(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update notification');
        }
    },

    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to update notifications');
        }
    }
};
