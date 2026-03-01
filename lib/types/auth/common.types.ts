

export interface AuthUserData {
    id: string;
    email: string;
    role: string;
    username: string;
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
