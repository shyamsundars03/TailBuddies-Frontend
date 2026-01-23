// Auth validation types and functions
export interface SignUpData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  gender: string
  role: string
}

export interface SignInData {
  email: string
  password: string
  role: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateSignUp(data: SignUpData): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Phone validation (10 digits)
  const phoneRegex = /^\d{10}$/
  if (!data.phone || !phoneRegex.test(data.phone)) {
    errors.phone = "Phone number must be 10 digits"
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }

  // Confirm password validation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateSignIn(data: SignInData): ValidationResult {
  const errors: Record<string, string> = {}

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Password validation
  if (!data.password || data.password.length < 1) {
    errors.password = "Password is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateForgotPassword(email: string): ValidationResult {
  const errors: Record<string, string> = {}

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateOTP(otp: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!otp || otp.length !== 6) {
    errors.otp = "OTP must be 6 digits"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateResetPassword(password: string, confirmPassword: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
