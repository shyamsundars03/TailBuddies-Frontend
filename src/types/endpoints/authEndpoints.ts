// API endpoints for authentication

const authEndpoints = {
  // User authentication routes
  login: "/auth/login",
  signup: "/auth/signup",
  logout: "/auth/logout",

  // OTP routes
  createOtp: "/auth/otp",
  verifyOtp: "/auth/verify-otp",
  resendOtp: "/auth/resend-otp",

  // Password management
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  changePassword: "/auth/change-password",

  // Token management
  refreshToken: "/auth/refresh-token",

  // User profile
  getMe: "/auth/me",
  updateProfile: "/auth/update-profile",
}

export default authEndpoints
