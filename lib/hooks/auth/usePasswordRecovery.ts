import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientCookies } from '../../utils/clientCookies';
import { passwordService } from '../../services/auth/password.service';
import logger from '../../logger/index';
import { toast } from 'sonner';
import { AUTH_ROUTES } from '../../constants/routes';
import { ForgotPasswordParams, ResetPasswordParams } from '../../types/auth/auth.types';
import { forgotPasswordSchema, resetPasswordSchema } from '../../validation/auth';
import { z } from 'zod';

export const usePasswordRecovery = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const forgotPassword = async (params: ForgotPasswordParams) => {
        try {
            forgotPasswordSchema.parse(params);
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) formattedErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(formattedErrors);
            }
            return { success: false, error: 'Validation failed' };
        }

        setIsLoading(true);
        try {
            const result = await passwordService.forgot(params);
            if (result.success) {
                if (typeof window !== 'undefined') {
                    const normalizedEmail = params.email.toLowerCase();
                    sessionStorage.setItem(`otp_purpose_${normalizedEmail}`, 'reset');
                    clientCookies.set('auth_action_pending', 'true', 600);
                }
                toast.success("Please check your email for the OTP.");
                router.push(`${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(params.email)}&purpose=reset`);
                return { success: true };
            } else {
                toast.error(result.message || result.error || "Failed to send reset link.");
                return { success: false };
            }
        } catch (error) {
            logger.error('Forgot password error', error);
            toast.error("An error occurred.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (params: ResetPasswordParams) => {
        try {
            resetPasswordSchema.parse(params);
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) formattedErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(formattedErrors);
            }
            return { success: false, error: 'Validation failed' };
        }

        setIsLoading(true);
        try {
            const result = await passwordService.reset(params);
            if (result.success) {
                clientCookies.delete('auth_action_pending');
                toast.success("Password reset successfully!");
                router.push(AUTH_ROUTES.SIGNIN);
                return { success: true };
            } else {
                toast.error(result.message || result.error || "Failed to reset password.");
                return { success: false };
            }
        } catch (error) {
            logger.error('Reset password error', error);
            toast.error("An error occurred.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        forgotPassword,
        resetPassword,
        isLoading,
        errors,
        setErrors,
    };
};
