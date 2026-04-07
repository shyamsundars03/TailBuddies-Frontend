import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorStats {
    totalPatients: number;
    patientsToday: number;
    appointmentsToday: number;
}

interface DoctorProfileData {
    qualification: string;
    specialty: string;
    isActive: boolean;
    verificationStatus: {
        clinic: boolean;
        education: boolean;
        experience: boolean;
        certificates: boolean;
        businessHours: boolean;
    };
    appointmentDuration: number;
}

interface DoctorState {
    profile: DoctorProfileData | null;
    stats: DoctorStats;
    isLoading: boolean;
    error: string | null;
}

const initialState: DoctorState = {
    profile: null,
    stats: {
        totalPatients: 0,
        patientsToday: 0,
        appointmentsToday: 0,
    },
    isLoading: false,
    error: null,
};

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctorProfile: (state, action: PayloadAction<DoctorProfileData>) => {
            state.profile = action.payload;
        },
        setDoctorStats: (state, action: PayloadAction<DoctorStats>) => {
            state.stats = action.payload;
        },
        setDoctorLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setDoctorError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateDoctorAvailability: (state, action: PayloadAction<boolean>) => {
            if (state.profile) {
                state.profile.isActive = action.payload;
            }
        }
    },
});

export const { 
    setDoctorProfile, 
    setDoctorStats, 
    setDoctorLoading, 
    setDoctorError,
    updateDoctorAvailability 
} = doctorSlice.actions;

export default doctorSlice.reducer;
