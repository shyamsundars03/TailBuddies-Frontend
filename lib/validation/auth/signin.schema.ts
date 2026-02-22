// lib/validation/auth/signin.schema.ts
import { z } from 'zod';

export const signinSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid Gmail address (@gmail.com)'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['owner', 'doctor', 'admin']),
});

export type SigninFormData = z.infer<typeof signinSchema>;
