// lib/redux/slices/demoCheckSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    username: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    password?: string; // Storing password for mock login
    isVerified: boolean;
    otp?: string;
}

interface DemoCheckState {
    users: User[];
    logs: string[]; // For UI logging of what would be sent to backend
}

const initialState: DemoCheckState = {
    users: [],
    logs: [],
};

export const demoCheckSlice = createSlice({
    name: 'demoCheck',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
            state.logs.push(`MOCK_BACKEND: Registered user ${action.payload.email}`);
        },
        verifyUser: (state, action: PayloadAction<string>) => {
            const user = state.users.find(u => u.email === action.payload);
            if (user) {
                user.isVerified = true;
                state.logs.push(`MOCK_BACKEND: Verified user ${action.payload}`);
            }
        },
        addLog: (state, action: PayloadAction<string>) => {
            state.logs.push(action.payload);
        },
    },
});

export const { addUser, verifyUser, addLog } = demoCheckSlice.actions;
export default demoCheckSlice.reducer;
