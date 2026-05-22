import * as z from "zod";

export const changeEmailSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
