import { z } from "zod";

export const basicDetailsSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    gender: z.enum(["female", "male", "other"]),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export const experienceSchema = z.object({
    role: z.string().min(2, "Role must be at least 2 characters"),
    organization: z.string().min(2, "Organization name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isCurrent: z.boolean().default(false),
    experienceFile: z.string().optional(),
}).refine((data) => {
    if (data.isCurrent) return true;
    if (!data.endDate) return false;
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

export const educationSchema = z.object({
    degree: z.string().min(2, "Degree is required"),
    institute: z.string().min(2, "Institute name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    educationFile: z.string().optional(),
}).refine((data) => {
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

export const clinicInfoSchema = z.object({
    clinicName: z.string().min(2, "Clinic name is required"),
    clinicPic: z.string().optional(),
    address: z.object({
        doorNo: z.string().min(1, "Door No is required"),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    }),
    location: z.object({
        type: z.literal("Point"),
        coordinates: z.array(z.number()).length(2),
    }).optional(),
});

export const certificatesSchema = z.object({
    certificateName: z.string().min(2, "Certificate name is required"),
    issuedBy: z.string().min(2, "Issued by is required"),
    certificateFile: z.string().min(1, "Certificate file is required"),
    issuedYear: z.string().regex(/^\d{4}$/, "Issued year must be a 4-digit year"),
});

export const businessHoursSchema = z.array(z.object({
    day: z.string(),
    isWorking: z.boolean(),
    slots: z.array(z.string()),
}));
