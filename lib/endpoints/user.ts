
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  PROFILE_PIC: '/user/profile-pic',
  CHANGE_EMAIL_INITIATE: '/user/change-email/initiate',
  CHANGE_EMAIL_VERIFY_CURRENT: '/user/change-email/verify-current',
  CHANGE_EMAIL_SEND_OTP_NEW: '/user/change-email/send-otp-new',
  CHANGE_EMAIL_VERIFY_NEW: '/user/change-email/verify-new',
  CHANGE_PASSWORD: '/user/change-password',
} as const;
