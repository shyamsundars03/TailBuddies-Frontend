// lib/dto/auth/signup.dto.ts

import type { SignupFormData, SignupApiRequest } from '../../types/auth/signup.types';

export class SignupDTO {
  static toApi(formData: SignupFormData): SignupApiRequest {
    return {
      username: formData.username.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      password: formData.password, // Only password, no confirmPassword
      gender: formData.gender,
      role: formData.role,
    };
  }
}