export const NOTIFICATION_ENDPOINTS = {
    LIST: (status?: string) => {
        let url = '/notifications';
        if (status) url += `?status=${status}`;
        return url;
    },
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
} as const;
