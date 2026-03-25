

export type UserRole = 'owner' | 'doctor';

export interface SignupFormData {
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;  // used for validation but not sent to API
  gender: 'Male' | 'Female' | 'Other';
  role: UserRole;
}

export interface SignupApiRequest {
  userName: string;
  email: string;
  phone: string;
  password: string; 
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
  userName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  role?: string;
}