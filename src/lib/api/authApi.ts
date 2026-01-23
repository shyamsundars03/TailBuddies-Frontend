import axiosClient from "./axiosClient"
import authEndpoints from "../../types/endpoints/authEndpoints"
import type {
  SignupData,
  LoginData,
  OTPData,
  ResetPasswordData,
  ChangePasswordData,
  AuthResponse,
} from "../../types/auth.types"

export const authApi = {
  // Sign up
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post(authEndpoints.signup, data)
      return response as unknown as AuthResponse
    } catch (error: unknown) {
      throw error
    }
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post(authEndpoints.login, data)
      return response as unknown as AuthResponse
    } catch (error: unknown) {
      throw error
    }
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.post(authEndpoints.logout)
      return response as unknown as { success: boolean; message: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.post(authEndpoints.forgotPassword, { email })
      return response as unknown as { success: boolean; message: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Create OTP
  createOtp: async (
    email: string,
    purpose: string,
  ): Promise<{ success: boolean; data: { email: string; expiresAt: string } }> => {
    try {
      const response = await axiosClient.post(authEndpoints.createOtp, { email, purpose })
      return response as unknown as { success: boolean; data: { email: string; expiresAt: string } }
    } catch (error: unknown) {
      throw error
    }
  },

  // Verify OTP
  verifyOtp: async (data: OTPData): Promise<{ success: boolean; message: string; token?: string }> => {
    try {
      const response = await axiosClient.post(authEndpoints.verifyOtp, data)
      return response as unknown as { success: boolean; message: string; token?: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Resend OTP
  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.post(authEndpoints.resendOtp, { email })
      return response as unknown as { success: boolean; message: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.post(authEndpoints.resetPassword, data)
      return response as unknown as { success: boolean; message: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.patch(authEndpoints.changePassword, data)
      return response as unknown as { success: boolean; message: string }
    } catch (error: unknown) {
      throw error
    }
  },

  // Get current user
  getMe: async (): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.get(authEndpoints.getMe)
      return response as unknown as AuthResponse
    } catch (error: unknown) {
      throw error
    }
  },
}

export default authApi
