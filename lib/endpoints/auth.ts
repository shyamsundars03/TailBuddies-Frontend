
export const AUTH_ENDPOINTS = {
  GOOGLE_LOGIN: '/auth/google-login',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  SIGNIN: '/auth/signin',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
} as const;
