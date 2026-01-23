// Auth types for TailBuddies

export type UserRole = "owner" | "doctor" | "admin"

export interface User {
  userId: string
  username: string
  email: string
  phone: string
  role: UserRole
  profilePic?: string
  isBlocked: boolean
  createdAt: string
  token?: string
}

export interface SignupData {
  username: string
  email: string
  phone: string
  password: string
  role: UserRole
  gender: string
}

export interface LoginData {
  email: string
  password: string
  role: UserRole
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
  message?: string
}

export interface OTPData {
  email: string
  otp: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}
