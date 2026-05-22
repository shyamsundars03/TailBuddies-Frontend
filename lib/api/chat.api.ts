import apiClient from './apiClient';
import { CHAT_ENDPOINTS } from '../endpoints/chat';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse } from '../types/api.types';

export const chatApi = {
    getChatHistory: async (appointmentId: string): Promise<ApiResponse<unknown>> => {
        try {
            const response = await apiClient.get(CHAT_ENDPOINTS.HISTORY(appointmentId));
            return response.data;
        } catch (error: unknown) {
            console.error('Error fetching chat history:', error);
            return handleApiError(error, 'Failed to fetch history');
        }
    }
};

