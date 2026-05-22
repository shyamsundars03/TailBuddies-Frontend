import { PaginatedResponse } from "../api.types";
import type {
    DoctorBusinessHour,
    DoctorCertificate,
    DoctorClinicInfo,
    DoctorEducation,
    DoctorExperience,
    DoctorRecurringSchedule,
    DoctorVerificationStatus,
} from "../doctor/doctor.model";

export interface Specialty {
    id: string
    _id?: string
    name: string
    description: string
    commonDesignation: string[]
    typicalKeywords: string[]
    status: 'active' | 'inactive'
}

export interface AdminUser {
    id: string
    _id?: string
    username: string
    email: string
    phone: string
    role: "owner" | "doctor"
    isBlocked: boolean
    profilePic?: string
    specialty?: string
}

/** Doctor as returned by API (sections may be empty while profile is incomplete). */
export interface DoctorDetail {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        role: string;
        profilePic?: string;
        gender?: string;
        phone?: string;
        isBlocked: boolean;
    };
    profile?: {
        designation?: string;
        specialtyId?: { _id: string; name: string } | string;
        experienceYears?: number;
        consultationFees?: number;
        about?: string;
        keywords?: string[];
    };
    clinicInfo?: DoctorClinicInfo;
    experience?: DoctorExperience[];
    education?: DoctorEducation[];
    certificates?: DoctorCertificate[];
    businessHours?: DoctorBusinessHour[];
    recurringSchedules?: DoctorRecurringSchedule[];
    verificationStatus: DoctorVerificationStatus;
    isVerified: boolean;
    isActive?: boolean;
    appointmentDuration?: number;
    totalAppointments?: number;
    averageRating?: number;
    reviewCount?: number;
    profileStatus: string;
    rejectionReason?: string | null;
}

export interface Pet {
    _id: string;
    petId?: string; // from list view
    name: string;
    species: string;
    breed: string;
    gender: string;
    dob: string;
    age: string;
    weight: string;
    picture?: string;
    image?: string; // from list view
    isVaccinated: string;
    isActive: boolean;
    isBlocked?: boolean; // from list view
    ownerId: {
        _id: string;
        username: string;
        email: string;
        phone: string;
        profilePic?: string;
        isBlocked: boolean;
    };
    vaccinations?: Array<{
        vaccinationName: string;
        takenDate: string;
        dueDate: string;
        certificate?: string;
        isVerified?: boolean;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    cards: {
        totalDoctors: number;
        totalPets: number;
        totalOwners: number;
        totalRevenue: number;
    };
    graphData: {
        labels: string[];
        revenue: number[];
        appointments: number[];
    };
}

export interface ReportItem {
    sNo: number;
    doctorId: string;
    doctorName: string;
    email: string;
    phone: string;
    profilePic: string;
    specialty: string;
    memberSince: string | Date;
    earned: number;
    noOfAppointments: number;
}

export interface SpecialtyStat {
    specialtyName: string;
    noOfDoctors: number;
    noOfAppointments: number;
    revenue: number;
}

export interface Appointment {
    _id: string;
    appointmentId: string;
    doctorId: {
        _id: string;
        userId: {
            _id: string;
            username: string;
            profilePic?: string;
            email: string;
            phone: string;
        };
        profile: {
            designation: string;
            experienceYears: number;
            consultationFees: number;
        };
    };
    petId: {
        _id: string;
        name: string;
        species: string;
        breed: string;
        picture?: string;
        image?: string;
        gender?: string;
        type?: string;
        age?: string | number;
    };
    ownerId: {
        _id: string;
        username: string;
        email: string;
        phone: string;
    };
    appointmentDate: string;
    appointmentStartTime: string;
    appointmentEndTime: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    problemDescription?: string;
    symptoms?: string[];
    createdAt: string;
    serviceType: string;
    mode: string;
    transactionID?: string;
    delayStatus?: string;
    checkIn?: {
        ownerCheckInTime?: string;
        vetCheckInTime?: string;
    };
    checkOut?: {
        ownerCheckOutTime?: string;
        vetCheckOutTime?: string;
    };
    prescriptionId?: {
        _id?: string;
        clinicalFindings?: string;
        diagnosis?: string;
        vetNotes?: string;
        recommendedTests?: string[];
        medications?: {
            medicineName: string;
            dosage: string;
            frequency: string;
            duration: string;
        }[];
    };
    clinicalFindings?: string;
    diagnosis?: string;
    notes?: string;
    prescription?: {
        medicine: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    cancellation?: {
        cancelReason: string;
        cancelledBy?: string | { role?: string; username?: string };
        cancelledAt?: string;
    };
}

export interface Transaction {
    _id: string;
    transactionID: string;
    walletID: {
        _id: string;
        userId: {
            _id: string;
            username: string;
            email: string;
            profilePic?: string;
            role: string;
        };
    };
    amount: number;
    commission?: number;
    netAmount?: number;
    type: 'credit' | 'debit' | string;
    source: string;
    status: string;
    message?: string;
    createdAt: string;
    appointmentId?: string | Appointment;
    appointmentID?: string;
}

export interface DoctorVerificationItem {
    id: string
    name: string
    speciality: string
    memberSince: string
    memberSinceTime: string
    earned: string
    isBlocked: boolean
    image: string
    status: string
}

export interface GetSpecialtiesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
}

export interface GetAppointmentsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface UserManagementResponse extends PaginatedResponse<AdminUser> {
    ownerCount: number;
    doctorCount: number;
}
