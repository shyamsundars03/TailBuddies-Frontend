export const PET_ENDPOINTS = {
    // Owner specific
    OWNER_ADD_PET: '/user/pets',
    OWNER_GET_PETS: '/user/pets',
    OWNER_GET_PET_BY_ID: (id: string) => `/user/pets/${id}`,
    OWNER_UPDATE_PET: (id: string) => `/user/pets/${id}`,
    OWNER_TOGGLE_STATUS: (id: string) => `/user/pets/${id}/status`,
    OWNER_DELETE_PET: (id: string) => `/user/pets/${id}`,

    // Admin specific
    ADMIN_GET_ALL_PETS: '/admin/pets',
    ADMIN_GET_PET_BY_ID: (id: string) => `/admin/pets/${id}`,
};
