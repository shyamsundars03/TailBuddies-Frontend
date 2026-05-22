import * as z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(passwordRegex, {
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
