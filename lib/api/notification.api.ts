import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const notificationApi = {
    getNotifications: async (status?: string) => {
        try {
            let url = '/notifications';
            if (status) url += `?status=${status}`;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to fetch notifications' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    markAsRead: async (id: string) => {
        try {
            const response = await apiClient.patch(`/notifications/${id}/read`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to update notification' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await apiClient.patch('/notifications/read-all');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to update notifications' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
