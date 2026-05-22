
export const ADMIN_ROUTES = {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/usersManagement',
    DOCTORS: '/admin/doctorVerifications',
    PETS: '/admin/petsManagement',
    PET_DETAILS: (id: string) => `/admin/petsManagement/${id}`,
    SPECIALTIES: '/admin/specialitiesManagement',
    APPOINTMENTS: '/admin/appointmentManagement',
    TRANSACTIONS: '/admin/transactionManagement',
    PAYMENTS: '/admin/paymentApprovals',
    REVIEWS: '/admin/reviews',
    REVIEW_DETAILS: (id: string) => `/admin/reviews/${id}`,
    REPORTS: '/admin/reports',
    SIGNIN: '/admin/signin',
    HOME: '/admin/dashboard',
} as const;

export const PUBLIC_ROUTES = {
    HOME: '/home',
    LANDING: '/',
} as const;

export const DOCTOR_ROUTES = {
    DASHBOARD: '/doctor/dashboard',
    REQUESTS: '/doctor/requests',
    APPOINTMENTS: '/doctor/appointments',
    CALENDAR: '/doctor/calendar',
    PATIENTS: '/doctor/patients',
    REVIEWS: '/doctor/reviews',
    WALLET: '/doctor/wallet',
    PROFILE: '/doctor/profile',
    CHATS: '/doctor/chat',
    DOCTOR_DETAILS: (id: string) => `/doctor/profile/${id}`,
    APPOINTMENT_DETAILS: (id: string) => `/doctor/appointments/${id}`,
    REQUEST_DETAILS: (id: string) => `/doctor/requests/${id}`,
    PATIENT_DETAILS: (id: string) => `/doctor/patients/${id}`,
} as const;

export const OWNER_ROUTES = {
    ACCOUNT: '/owner/account',
    SERVICES: '/owner/services',
    PETS: '/owner/pets',
    BOOKINGS: '/owner/bookings',
    MEDICAL_RECORDS: '/owner/medical-records',
    CALENDAR: '/owner/calendar',
    WALLET: '/owner/wallet',
    REVIEWS: '/owner/reviews',
    PROFILE: '/owner/profile',
    SERVICE_DETAILS: (id: string) => `/owner/services/${id}`,
    BOOK_SERVICE: (id: string) => `/owner/services/${id}/book`,
    BOOKING_SUCCESS: (doctorId: string, appointmentId: string, appointmentCode: string) => `/owner/services/${doctorId}/book/success?id=${appointmentId}&appId=${appointmentCode}`,
    PET_DETAILS: (id: string) => `/owner/pets/${id}`,
    BOOKING_DETAILS: (id: string) => `/owner/bookings/${id}`,
    PAYMENT_FAILURE: (id: string) => `/owner/payment/failure?id=${id}`,
} as const;

export const AUTH_ROUTES = {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_OTP: '/verify-otp',
    VERIFY_EMAIL: '/verify-email',
    DOCTOR_SIGNIN: '/signin?role=doctor',
} as const;
