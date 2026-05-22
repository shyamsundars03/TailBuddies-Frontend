export const CHAT_ENDPOINTS = {
    HISTORY: (appointmentId: string) => `/chat/${appointmentId}`,
} as const;
