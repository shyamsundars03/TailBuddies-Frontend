import { ApiResponse } from "../api.types";

export type UserRole = "owner" | "doctor" | "admin";

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    username: string;
    googleId?: string;
    profilePic?: string;
    phone?: string;
    gender?: string;
}

export interface AuthResponseData {
    user: AuthUser;
    accessToken?: string;
}

export type AuthApiResponse = ApiResponse<AuthResponseData>;

export interface LoginParams {
    email: string;
    password?: string;
    role: UserRole;
}

export interface GoogleLoginParams {
    idToken: string;
    role: UserRole;
}

export interface SignupParams {
    username: string;
    email: string;
    phone: string;
    password: string;
    gender: string;
    role: "owner" | "doctor";
}

export interface VerifyOtpParams {
    email: string;
    otp: string;
    userData?: Record<string, unknown>;
    purpose?: string;
}

export interface ResendOtpParams {
    email: string;
}

export interface ForgotPasswordParams {
    email: string;
}

export interface ResetPasswordParams {
    email: string;
    otp: string;
    password?: string;
    confirmPassword?: string;
}
