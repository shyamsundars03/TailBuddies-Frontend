import { z } from "zod"

export const specialtySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    commonDesignation: z.array(z.string()).min(1, "At least one designation is required"),
    typicalKeywords: z.array(z.string()).min(1, "At least one keyword is required"),
    status: z.enum(["active", "inactive"]),
})
