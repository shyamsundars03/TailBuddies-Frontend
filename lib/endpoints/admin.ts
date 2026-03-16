
export const ADMIN_ENDPOINTS = {
  SPECIALTIES: '/admin/specialties',

  SPECIALTY_BY_ID: (id: string) => `/admin/specialties/${id}`,
  
  USERS: '/admin/users',
  

    
    TOGGLE_USER_BLOCK: (id: string) => `/admin/users/${id}/block`,
} as const;
