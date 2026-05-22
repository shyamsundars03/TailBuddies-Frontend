
export const ADMIN_ENDPOINTS = {
  SIGNIN: '/admin/signin',

  // Analytics & Dashboard
  DASHBOARD_STATS: '/admin/dashboard-stats',
  REPORTS: '/admin/reports',
  SPECIALTY_STATS: '/admin/specialty-stats',

  // Specialties Management
  SPECIALTIES: '/admin/specialties',
  SPECIALTY_BY_ID: (id: string) => `/admin/specialties/${id}`,
  SPECIALTIES_LIST: (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    return `${ADMIN_ENDPOINTS.SPECIALTIES}?${params.toString()}`;
  },

  // Users Management
  USERS: '/admin/users',
  USERS_LIST: (page: number, limit: number, role?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (role && role !== 'all') params.append('role', role);
    if (search) params.append('search', search);
    return `${ADMIN_ENDPOINTS.USERS}?${params.toString()}`;
  },
  TOGGLE_USER_BLOCK: (id: string) => `/admin/users/${id}/block`,

  // Pets Management
  PETS: '/admin/pets',
  PET_BY_ID: (id: string) => `/admin/pets/${id}`,
  PETS_LIST: (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    return `${ADMIN_ENDPOINTS.PETS}?${params.toString()}`;
  },

  // Doctor Management & Verifications
  DOCTORS: '/admin/doctors',
  DOCTOR_BY_ID: (id: string) => `/admin/doctors/${id}`,
  VERIFY_DOCTOR: (id: string) => `/admin/doctors/${id}/verify`,
  DOCTORS_LIST: (page: number, limit: number, search?: string, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return `${ADMIN_ENDPOINTS.DOCTORS}?${params.toString()}`;
  },

  // Appointments Management
  APPOINTMENTS_ALL: '/appointments/all',
  APPOINTMENT_BY_ID: (id: string) => `/appointments/${id}`,
} as const;
