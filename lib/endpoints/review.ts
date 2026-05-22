export const REVIEW_ENDPOINTS = {
    CREATE: '/reviews',
    BY_ID: (id: string) => `/reviews/${id}`,
    REPLY: (id: string) => `/reviews/${id}/reply`,
    DOCTOR_REVIEWS: (page: number = 1, limit: number = 4, search: string = '') => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (search) params.append('search', search);
        return `/reviews/doctor/me?${params.toString()}`;
    },
    OWNER_REVIEWS: (page: number = 1, limit: number = 4, search: string = '') => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (search) params.append('search', search);
        return `/reviews/owner/me?${params.toString()}`;
    },
    ALL_REVIEWS: (page: number = 1, limit: number = 4, search: string = '') => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (search) params.append('search', search);
        return `/reviews/all?${params.toString()}`;
    },
    BY_APPOINTMENT: (appointmentId: string) => `/reviews/appointment/${appointmentId}`,
    BY_DOCTOR_ID: (doctorId: string, page: number = 1, limit: number = 10, search: string = '') => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (search) params.append('search', search);
        return `/reviews/doctor/${doctorId}?${params.toString()}`;
    }
} as const;
