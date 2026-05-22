import apiClient from './apiClient';
import { SLOT_ENDPOINTS } from '../endpoints/slot';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse } from '../types/api.types';

export const slotApi = {
    blockSlots: async (slotIds: string[]): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(SLOT_ENDPOINTS.BLOCK, { slotIds });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to block slots');
        }
    },
    unblockSlots: async (slotIds: string[]): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(SLOT_ENDPOINTS.UNBLOCK, { slotIds });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to unblock slots');
        }
    }
};
