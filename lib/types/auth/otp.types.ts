

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface OtpApiResponse {
    success: boolean;
    message?: string;
    data?: {
        user: {
            id: string;
            email: string;
            role: string;
            username: string;
        };
    };
    error?: string;
}
