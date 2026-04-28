
import { z } from 'zod';

export const signinSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required'),
        // .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid Gmail address (@gmail.com)'),

    password: z
        .string()
        .min(1, 'Password is required'),
        // .regex(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        //     'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        // ),

    role: z.enum(['owner', 'doctor', 'admin']),
});

export type SigninFormData = z.infer<typeof signinSchema>;

//  password: z
   // .string()
 //   .min(1, 'Password is required')
 //   .regex(
  //    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
 //     'Password must include uppercase, lowercase, number and special character'
 //   ),



