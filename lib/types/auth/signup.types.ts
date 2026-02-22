// lib/types/auth/signup.types.ts

export type UserRole = 'owner' | 'doctor';

export interface SignupFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;  // Local-only: used for validation but not sent to API
  gender: 'Male' | 'Female' | 'Other';
  role: UserRole;
}

export interface SignupApiRequest {
  username: string;
  email: string;
  phone: string;
  password: string; // The only password field sent to the backend
  gender: string;
  role: UserRole;
}

export interface SignupApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface SignupFormErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  role?: string;
}