/**
 * Mirrors tailbuddies-backend/src/models/doctor.model.ts (IDoctor).
 * Use this for doctor profile + admin verification — same shape the API returns.
 */

export interface DoctorAddress {
    doorNo?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

export interface DoctorClinicInfo {
    clinicName?: string;
    clinicPic?: string;
    address?: DoctorAddress;
    location?: {
        type?: "Point" | string;
        coordinates?: number[];
    };
}

export interface DoctorExperience {
    role: string;
    organization: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    experienceFile?: string;
}

export interface DoctorEducation {
    degree: string;
    institute: string;
    startDate: string;
    endDate: string;
    educationFile?: string;
}

export interface DoctorCertificate {
    certificateName: string;
    issuedBy: string;
    certificateFile: string;
    issuedYear: string;
    isVerified?: boolean;
    rejectionReason?: string;
}

export interface DoctorBusinessHour {
    day: string;
    isWorking: boolean;
    startTime: string;
    endTime: string;
    duration: string;
    slots: string[];
}

export interface DoctorRecurringSchedule {
    id: string;
    rrule: string;
    dtstart: string | Date;
    dtend?: string | Date;
    isWorking: boolean;
    startTime: string;
    endTime: string;
}

export interface DoctorVerificationStatus {
    clinic: boolean;
    education: boolean;
    experience: boolean;
    certificates: boolean;
    businessHours: boolean;
    [section: string]: boolean;
}

export interface DoctorProfileData {
    specialtyId: string | { _id: string; name: string };
    designation: string;
    about: string;
    consultationFees: number;
    keywords: string[];
    experienceYears: number;
}

export interface DoctorRecord {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        role?: string;
        profilePic?: string;
        gender?: string;
        phone?: string;
        isBlocked?: boolean;
    };
    profile: DoctorProfileData;
    clinicInfo: DoctorClinicInfo;
    experience: DoctorExperience[];
    education: DoctorEducation[];
    certificates: DoctorCertificate[];
    businessHours: DoctorBusinessHour[];
    verificationStatus: DoctorVerificationStatus;
    profileStatus: "incomplete" | "under_review" | "verified" | "rejected";
    rejectionReason?: string | null;
    isVerified: boolean;
    isActive: boolean;
    appointmentDuration: number;
    totalAppointments: number;
    averageRating?: number;
    reviewCount?: number;
    recurringSchedules?: DoctorRecurringSchedule[];
    createdAt?: string;
    updatedAt?: string;
}
