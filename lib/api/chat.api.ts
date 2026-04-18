import apiClient from './apiClient';

export const chatApi = {
    getChatHistory: async (appointmentId: string) => {
        try {
            const response = await apiClient.get(`/chat/${appointmentId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching chat history:', error);
            return { success: false, message: error.message || 'Failed to fetch history' };
        }
    }
};
