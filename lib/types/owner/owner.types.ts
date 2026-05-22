export interface BookingData {
    type: string;
    petId: string;
    petName?: string;
    problemDescription: string;
    symptoms: string[];
    date: string;
    rawDate: string;
    time: string;
    timeSlot?: string;
    slotId: string;
    mode: "online" | "offline";
    appointmentType?: string;
    paymentMethod: string;
}

export interface OwnerProfile {
    username: string;
    email: string;
    phone: string;
    gender: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    profilePic?: string;
    googleId?: string;
}

export interface ReviewReply {
    comment: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Review {
    _id: string;
    appointmentId?: {
        _id: string;
        appointmentId: string;
        appointmentDate?: string;
        appointmentStartTime?: string;
    };
    doctorId?: {
        _id: string;
        userId?: {
            _id: string;
            username: string;
            profilePic?: string;
        };
        profile?: {
            designation?: string;
        };
    };
    ownerId?: {
        _id?: string;
        username?: string;
        profilePic?: string;
        email?: string;
    };
    rating: number;
    comment: string;
    isReplied?: boolean;
    reply?: ReviewReply;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorReview extends Review {
    ownerId?: {
        username?: string;
    };
}

export interface PetVaccination {
    vaccinationName: string;
    takenDate: string;
    dueDate: string;
    certificate?: string | File;
    isVerified?: boolean;
}

export interface OwnerPet {
    _id: string;
    id?: string;
    petId?: string;
    name: string;
    species: string;
    breed: string;
    gender: "Male" | "Female";
    age: string;
    dob: string;
    weight: string;
    picture?: string;
    image?: string;
    vaccinated: "YES" | "NO";
    vaccinations?: PetVaccination[];
    isActive: boolean;
    isBlocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface WalletTransaction {
    _id: string;
    transactionID: string;
    humanReadableId?: string;
    amount: number;
    netAmount?: number;
    type: "credit" | "debit" | string;
    source: string;
    status: string;
    message?: string;
    createdAt: string;
    appointmentId?: string;
    appointmentID?: string;
}

export interface OwnerWallet {
    _id: string;
    userId: string;
    balance?: number;
    isRequested?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingDoctor {
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
}

export interface BookingPet {
    _id: string;
    id?: string;
    name: string;
    species: string;
    breed: string;
    picture?: string;
    image?: string;
    gender?: string;
    dob?: string;
    weight?: string;
    type?: string;
    age?: string | number;
    ownerId?: {
        _id?: string;
        username?: string;
        email?: string;
        phone?: string;
    };
    ownerName?: string;
    ownerEmail?: string;
    lastAppointmentDate?: string;
}

export interface OwnerAppointmentStats {
    booked: number;
    confirmed: number;
    ongoing: number;
    pending: number;
    cancelled: number;
    completed: number;
}

export interface OwnerAppointment {
    _id: string;
    appointmentId: string;
    doctorId: BookingDoctor;
    petId: BookingPet;
    appointmentDate: string;
    appointmentStartTime: string;
    appointmentEndTime: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    problemDescription?: string;
    symptoms?: string[];
    serviceType: string;
    mode: string;
    transactionID?: string;
    ownerId?: {
        _id?: string;
        username?: string;
    };
    cancellation?: {
        cancelReason: string;
        cancelledBy?: string | { role?: string; username?: string };
        cancelledAt?: string;
    };
    prescriptionId?: {
        _id?: string;
        clinicalFindings?: string;
        diagnosis?: string;
        vetNotes?: string;
        recommendedTests?: string;
        medications?: {
            medicineName: string;
            dosage: string;
            frequency: string;
            duration: string;
        }[];
    };
    createdAt: string;
    checkIn?: {
        ownerCheckInTime?: string;
        vetCheckInTime?: string;
    };
    checkOut?: {
        ownerCheckOutTime?: string;
        vetCheckOutTime?: string;
    };
}
