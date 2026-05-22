export const APPOINTMENT_ENDPOINTS = {
    CREATE: '/appointments',
    OWNER_APPOINTMENTS: (page = 1, limit = 10, search = "", status = "", timeframe = "", pet = "") => {
        let url = `/appointments?page=${page}&limit=${limit}&search=${search}`;
        if (status) url += `&status=${status}`;
        if (timeframe) url += `&timeframe=${timeframe}`;
        if (pet) url += `&pet=${pet}`;
        return url;
    },
    ALL_APPOINTMENTS: (page = 1, limit = 10, search = "", status = "") => 
        `/appointments/all?page=${page}&limit=${limit}&search=${search}&status=${status}`,
    DOCTOR_APPOINTMENTS: (status?: string, page = 1, limit = 10, search = "") => {
        let url = `/appointments/doctor?page=${page}&limit=${limit}&search=${search}`;
        if (status) url += `&status=${status}`;
        return url;
    },
    DOCTOR_PATIENTS: (page = 1, limit = 10, search = "", species = "", date = "") => {
        let url = `/appointments/doctor/patients?page=${page}&limit=${limit}&search=${search}`;
        if (species) url += `&species=${species}`;
        if (date) url += `&date=${date}`;
        return url;
    },
    BY_ID: (id: string) => `/appointments/${id}`,
    UPDATE_STATUS: (id: string) => `/appointments/${id}/status`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    SLOTS: (doctorId: string, date: string) => `/appointments/slots?doctorId=${doctorId}&date=${date}`,
    CHECK_IN: (id: string) => `/appointments/${id}/check-in`,
    CHECK_OUT: (id: string) => `/appointments/${id}/check-out`,
    DOCTOR_STATS: '/appointments/doctor/stats',
    OWNER_STATS: '/appointments/owner/stats',
    CANCEL_PENDING: (id: string) => `/appointments/${id}/cancel-pending`,
    CHECK_SLOT: (id: string) => `/appointments/${id}/check-slot`,
    AGORA_TOKEN: (channelName: string, uid?: string | number, role?: 'publisher' | 'subscriber') => {
        let url = `/agora/rtc-token?channelName=${channelName}`;
        if (uid) url += `&uid=${uid}`;
        if (role) url += `&role=${role}`;
        return url;
    },
    DOCTOR_SLOTS: (date: string) => `/appointments/doctor/slots?date=${date}`,
} as const;
