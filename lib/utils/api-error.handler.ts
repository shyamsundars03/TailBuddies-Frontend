import { AxiosError } from "axios";
import { ApiResponse } from "../types/api.types";

/**
 * Standardized handler for API errors.
 * Extracts the message from Axios errors or returns a default message.
 */
type ApiErrorBody = {
    message?: string
    error?: string
    errors?: Array<{ path?: string; message?: string }>
}

export const handleApiError = (error: unknown, defaultMessage: string = "An unexpected error occurred"): ApiResponse<never> => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorBody | undefined
        const validationDetail = data?.errors?.length
            ? data.errors.map((e) => e.message || e.path).filter(Boolean).join(", ")
            : undefined
        return {
            success: false,
            message: validationDetail || data?.message || error.message || defaultMessage,
            error: data?.error || error.code || "API_ERROR"
        };
    }
    
    if (error instanceof Error) {
        return {
            success: false,
            message: error.message,
            error: "INTERNAL_ERROR"
        };
    }

    return {
        success: false,
        message: defaultMessage,
        error: "UNKNOWN_ERROR"
    };
};
