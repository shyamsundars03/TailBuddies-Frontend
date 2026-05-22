import * as z from "zod";

export const accountDetailsSchema = z.object({
  username: z.string()
    .min(1, { message: "Username is required" })
    .regex(/^[A-Za-z0-9\s,.-]+$/, { message: "Invalid username format" }),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  phone: z.string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[A-Za-z0-9\s,.-]+$/, { message: "Invalid phone number format" }),
});

export const addressDetailsSchema = z.object({
  address: z.string()
    .min(1, { message: "Address is required" })
    .min(5, { message: "Address is too short" }),
  city: z.string()
    .min(1, { message: "City is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Only letters and spaces allowed" }),
  state: z.string()
    .min(1, { message: "State is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Only letters and spaces allowed" }),
  country: z.string()
    .min(1, { message: "Country is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Only letters and spaces allowed" }),
  pincode: z.string()
    .min(1, { message: "Pincode is required" })
    .regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),
});

export type AccountDetailsValues = z.infer<typeof accountDetailsSchema>;
export type AddressDetailsValues = z.infer<typeof addressDetailsSchema>;
