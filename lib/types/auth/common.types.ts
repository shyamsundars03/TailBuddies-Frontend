

export interface AuthUserData {
    id: string;
    email: string;
    role: string;
    username: string;
    googleId?: string;
    profilePic?: string;
    phone?: string;
    gender?: string;
}

export interface AuthApiResponse {
    success: boolean;
    message?: string;
    data?: {
        user: AuthUserData;
        accessToken?: string;
    };
    error?: string;
}
