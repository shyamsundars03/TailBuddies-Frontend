

import { z } from 'zod';

export const signupSchema = z.object({
  userName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),

  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid Gmail address (@gmail.com)')
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be 10 digits'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password too long'),

  confirmPassword: z
    .string(),

  gender: z
    .enum(['Male', 'Female', 'Other']),

  role: z
    .enum(['owner', 'doctor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupSchema = z.infer<typeof signupSchema>;