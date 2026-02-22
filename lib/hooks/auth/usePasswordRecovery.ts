// lib/hooks/auth/usePasswordRecovery.ts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { passwordService } from '../../services/auth/password.service';
import logger from '../../logger/index';
import { toast } from 'sonner';

export const usePasswordRecovery = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const forgotPassword = async (email: string) => {
        setIsLoading(true);
        logger.info('Forgot password attempt', { email });
        try {
            const result = await passwordService.forgot(email);
            if (result.success) {
                toast.success("Please check your email for the OTP.");
                router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
                return { success: true };
            } else {
                toast.error(result.error || "Failed to send reset link.");
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

    const resetPassword = async (data: any) => {
        setIsLoading(true);
        logger.info('Reset password attempt');
        try {
            const result = await passwordService.reset(data);
            if (result.success) {
                toast.success("Password reset successfully!");
                router.push("/signin");
                return { success: true };
            } else {
                toast.error(result.error || "Failed to reset password.");
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
    };
};
