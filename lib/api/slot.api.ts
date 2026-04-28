import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const slotApi = {
    blockSlots: async (slotIds: string[]) => {
        try {
            const response = await apiClient.post('/slots/block', { slotIds });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to block slots' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    },
    unblockSlots: async (slotIds: string[]) => {
        try {
            const response = await apiClient.post('/slots/unblock', { slotIds });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || 'Failed to unblock slots' };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
