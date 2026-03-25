export const DOCTOR_ENDPOINTS = {
 
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_DOCTOR_BY_ID: (id: string) => `/admin/doctors/${id}`,
  ADMIN_VERIFY: (id: string) => `/admin/doctors/${id}/verify`,

  
  AUTH_DOCTORS: '/auth/doctors',
  AUTH_DOCTOR_BY_ID: (id: string) => `/auth/doctors/${id}`,
  AUTH_SPECIALTIES: '/auth/specialties',

  // Doctor-specific paths
  PROFILE: '/doctor/profile',
  UPDATE_PROFILE: '/doctor/profile',
  UPLOAD_DOCUMENT: '/doctor/upload-document',
  VERIFICATION_REQUEST: '/doctor/verification-request',

  
  DOCTORS_LIST: (page: number, limit: number, search?: string, isVerified?: boolean, status?: string, filters?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    if (isVerified !== undefined) params.append('isVerified', isVerified.toString());
    if (status) params.append('status', status);
    if (filters) {
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.experienceYears) params.append('experienceYears', filters.experienceYears);
    }
    return `${status || isVerified === undefined ? DOCTOR_ENDPOINTS.ADMIN_DOCTORS : DOCTOR_ENDPOINTS.AUTH_DOCTORS}?${params.toString()}`;
  },
} as const;
