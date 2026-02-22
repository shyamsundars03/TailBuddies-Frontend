// lib/types/auth/signin.types.ts

export interface SigninCredentials {
    email: string;
    password?: string;
    role: 'owner' | 'doctor' | 'admin';
}

export interface SigninApiResponse {
    success: boolean;
    message?: string;
    data?: {
        user: {
            id: string;
            email: string;
            role: string;
            username: string;
        };
        token: string;
    };
    error?: string;
}
