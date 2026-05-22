export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    total?: number;
}

export interface Owners<T>{
    items:T[]
}



export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export interface DoctorAppointmentStats {
    booked: number;
    confirmed: number;
    ongoing: number;
    cancelled: number;
    completed: number;
    requests: number;
    upcoming: number;
}

export type SlotAvailabilityData = boolean;

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

export interface RazorpayOrderPayload {
    order: RazorpayOrder;
}

export interface AgoraTokenData {
    token: string;
}

export interface AvailableSlot {
    _id: string;
    startTime: string;
    endTime: string;
    mode?: string;
    status?: string;
    isBooked?: boolean;
    isBlocked?: boolean;
}

export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    createdAt: string;
    status: 'unread' | 'read';
    link?: string;
    type: string;
}

export interface AiSuggestedDoctor {
    _id: string;
    userId?: {
        username?: string;
        profilePic?: string;
    };
    profile?: {
        designation?: string;
        specialtyId?: { name?: string };
        consultationFees?: number;
    };
    clinicInfo?: {
        address?: { city?: string };
    };
}

export interface AiAnalysisData {
    identifiedSpecialty: string;
    carePlan: string;
    suggestedDoctors: AiSuggestedDoctor[];
}

export interface PrescriptionMedication {
    medicineName?: string;
    name?: string;
    medicine?: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
}

export interface Prescription {
    _id: string;
    appointmentId?: string;
    prescriptionId?: string;
    clinicalFindings?: string;
    diagnosis?: string;
    vetNotes?: string;
    createdAt?: string;
    vetId?: {
        userId?: { username?: string; profilePic?: string };
        profile?: { designation?: string };
    };
    petId?: {
        name?: string;
        species?: string;
        breed?: string;
        picture?: string;
    };
    vitals?: {
        temperature?: string;
        pulse?: string;
        respiration?: string;
        weight?: string;
    };
    symptoms?: string[];
    followUpDate?: string;
    medications?: PrescriptionMedication[];
}

export interface AgoraCallConfig {
    token: string;
    channelName: string;
    uid: string;
    appId?: string;
}

export interface PrescriptionFormData {
    vitals?: {
        temperature?: string;
        pulse?: string;
        respiration?: string;
    };
    clinicalFindings?: string;
    diagnosis?: string;
    vetNotes?: string;
    symptoms?: string[];
    medications?: {
        name?: string;
        medicineName?: string;
        dosage: string;
        frequency: string;
        duration: string;
        notes?: string;
    }[];
}

export interface ReportFilters {
    from: string;
    to: string;
    specialtyId: string;
    search: string;
}
