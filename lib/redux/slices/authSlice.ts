

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string | null;
    email: string | null;
    role: string | null;
    username: string | null;
    googleId?: string | null;
    phone?: string | null;
    gender?: string | null;
    image?: string | null;
    profilePic?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
}

interface AuthState {
    user: UserState | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState | null>) => {
            if (action.payload) {
                state.user = action.payload;
                state.isAuthenticated = true;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            } else {
                state.user = null;
                state.isAuthenticated = false;
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
