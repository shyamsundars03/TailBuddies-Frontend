// lib/constants/index.ts

export * from './httpStatus';

export const StorageKeys = {
  TOKEN: 'token',
  USER: 'user',
  USER_ROLE: 'user_role',
} as const;

export const ErrorMessages = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission for this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
} as const;

export const SuccessMessages = {
  LOGIN: 'Login successful!',
  SIGNUP: 'Account created successfully!',
  LOGOUT: 'Logged out successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
} as const;