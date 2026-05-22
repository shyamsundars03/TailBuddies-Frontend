import type { DoctorDetail } from "../admin/admin.types";
import type {
    DoctorEducation,
    DoctorExperience,
    DoctorCertificate,
    DoctorBusinessHour,
    DoctorRecurringSchedule,
} from "./doctor.model";
import type { z } from "zod";
import {
    educationSchema,
    experienceSchema,
    certificatesSchema,
    clinicInfoSchema,
    basicDetailsSchema,
} from "@/lib/validation/doctor/doctor.schema";

export type DoctorProfile = DoctorDetail;
export type DoctorProfileUpdate = Partial<DoctorDetail>;

export type DoctorEducationEntry = DoctorEducation;
export type DoctorExperienceEntry = DoctorExperience;
export type DoctorCertificateEntry = DoctorCertificate;
export type DoctorBusinessHourEntry = DoctorBusinessHour;
export type DoctorRecurringScheduleEntry = DoctorRecurringSchedule;

export type EducationFormData = z.infer<typeof educationSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type CertificateFormData = z.infer<typeof certificatesSchema>;
export type ClinicFormData = z.infer<typeof clinicInfoSchema>;
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;

export interface DoctorUserRef {
    _id?: string;
    username?: string | null;
    email?: string | null;
    gender?: string | null;
    phone?: string | null;
    profilePic?: string | null;
}

export interface SpecialtyOption {
    _id: string;
    name: string;
    commonDesignation?: string[];
    typicalKeywords?: string[];
}

export interface DoctorProfileTabProps {
    user: DoctorUserRef | null;
    doctor: DoctorProfile | null;
    onUpdate: (data: DoctorProfileUpdate) => void;
    isEditable?: boolean;
}
