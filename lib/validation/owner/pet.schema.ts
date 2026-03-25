import * as z from "zod";

const nameRegex = /^[A-Za-z]/;

const vaccinationSchema = z.object({
  vaccinationName: z.string()
    .min(2, { message: "Vaccination name must be at least 2 characters" })
    .regex(nameRegex, { message: "Name must start with a letter" }),
  takenDate: z.string().min(1, { message: "Taken date is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  certificate: z.any().optional(),
}).refine(
  (data) => {
    if (!data.takenDate || !data.dueDate) return true;
    const taken = new Date(data.takenDate);
    const due = new Date(data.dueDate);
    return due > taken;
  },
  {
    message: "Due date must be after taken date",
    path: ["dueDate"],
  }
);

export const petFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Pet name must be at least 2 characters" })
    .regex(nameRegex, { message: "Pet name must start with a letter" }),
  species: z.string().min(1, { message: "Please select a species" }),
  breed: z.string().min(1, { message: "Please select a breed" }),
  gender: z.enum(["Male", "Female"], {
    message: "Please select a gender",
  }),
  age: z.string().min(1, { message: "Age is required" }).regex(/^\d+(\.\d+)?$/, { message: "Age must be a valid number" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  weight: z.string().min(1, { message: "Weight is required" }).regex(/^\d+(\.\d+)?$/, { message: "Weight must be a valid number" }),
  picture: z.any().optional(),
  vaccinated: z.enum(["YES", "NO"], {
    message: "Please select vaccination status",
  }),
  vaccinations: z.array(vaccinationSchema).optional(),
}).refine(
  (data) => {
    if (!data.dob) return true;
    const dobDate = new Date(data.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day comparison
    return dobDate <= today;
  },
  {
    message: "Date of birth cannot be in the future",
    path: ["dob"],
  }
);

export type PetFormValues = z.infer<typeof petFormSchema>;
