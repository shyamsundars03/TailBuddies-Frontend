export interface DoctorFilters {
    [key: string]: string | undefined;
    specialty?: string;
    gender?: string;
    experienceYears?: string;
    city?: string;
    minRating?: string;
}


export interface Owners<T>{
    items:T[]
}


export interface DoctorResponse {
    _id: string;
    userId: {
        username: string;
        email: string;
        profilePic?: string;
        isBlocked: boolean;
    };
    profile?: {
        designation?: string;
        specialtyId?: { _id?: string; name?: string } | string;
        consultationFees?: number;
        experienceYears?: number;
        keywords?: string[];
        about?: string;
    };
    createdAt: string;
    profileStatus: string;
    clinicInfo?: {
        clinicPic?: string;
        clinicName?: string;
        address?: {
            doorNo?: string;
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
        };
    };
    businessHours?: import("./doctor.model").DoctorBusinessHour[];
    education?: Array<{
        degree: string;
        institute: string;
        startDate: string;
        endDate: string;
    }>;
    experience?: Array<{
        role: string;
        organization: string;
        startDate: string;
        endDate?: string;
        isCurrent: boolean;
    }>;
    recurringSchedules?: { dtstart?: string; dtend?: string }[];
    isVerified?: boolean;
    isActive?: boolean;
    averageRating?: number;
    reviewCount?: number;
    ownerCount?:number;
    appointmentDuration?: number;
}

export interface PaginatedDoctorResponse {
    success: boolean;
    data: {
        items: DoctorResponse[];
        total: number;
        page: number;
        limit: number;
    };
    error?: string;
    message?: string;
}
