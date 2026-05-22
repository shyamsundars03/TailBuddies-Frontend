export const PRESCRIPTION_ENDPOINTS = {
    CREATE: '/prescriptions',
    BY_APPOINTMENT_ID: (appointmentId: string) => `/prescriptions/appointment/${appointmentId}`,
    BY_ID: (id: string) => `/prescriptions/${id}`,
    DOWNLOAD_PDF: (id: string) => `/prescriptions/${id}/download`,
} as const;
