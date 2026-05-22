
/** Public discovery + auth (no bearer token required for GET discovery routes). */
export const AUTH_ENDPOINTS = {
  SPECIALTIES: '/auth/specialties',
  DOCTORS: '/auth/doctors',
  DOCTOR_BY_ID: (id: string) => `/auth/doctors/${id}`,

  GOOGLE_LOGIN: '/auth/google-login',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  SIGNIN: '/auth/signin',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
} as const;
