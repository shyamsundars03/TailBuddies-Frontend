import { z } from 'zod';

const emailSchema = z
    .string()
    .min(1, 'Email is required')
    // .email('Invalid email format')
    // .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid Gmail address (@gmail.com)')
    .toLowerCase()
    .trim();

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include uppercase, lowercase, number and special character (@$!%*?&)'
    );

export const signinSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'), // Login usually doesn't need strength check, just presence
    role: z.enum(['owner', 'doctor', 'admin']),
});

export const signupSchema = z.object({
    username: z
        .string()
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: emailSchema,
    phone: z
        .string()
        .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.enum(['Male', 'Female'], {
        message: 'Please select a gender'
    }),
    role: z.enum(['owner', 'doctor']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const resetPasswordSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const otpSchema = z.object({
    email: emailSchema,
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export type SigninFormData = z.infer<typeof signinSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
