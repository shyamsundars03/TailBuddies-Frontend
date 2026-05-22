import { useState, useCallback } from 'react';
import { clientCookies } from '../../utils/clientCookies';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/authSlice';
import { otpService } from '../../services/auth/otp.service';
import logger from '../../logger/index';
import { toast } from 'sonner';
import { ADMIN_ROUTES, DOCTOR_ROUTES, PUBLIC_ROUTES } from '../../constants/routes';
import { otpSchema } from '../../validation/auth';
import { z } from 'zod';
import { mapAuthUser } from '../../services/auth/auth.mapper';
import { AuthApiResponse, VerifyOtpParams, ResendOtpParams } from '../../types/auth/auth.types';

function getOtpPurpose(email: string): string | null {
    if (typeof window === 'undefined' || !email) return null;
    const normalizedEmail = email.toLowerCase();
    const sessionPurpose = sessionStorage.getItem(`otp_purpose_${normalizedEmail}`);
    if (sessionPurpose) return sessionPurpose;

    const params = new URLSearchParams(window.location.search);
    return params.get('purpose');
}

const TIMER_DURATION = Number(process.env.NEXT_PUBLIC_TIMER_DURATION) || 75;

export const setOtpTimer = (email: string) => {
    if (typeof window !== 'undefined') {
        const expiry = Date.now() + TIMER_DURATION * 1000;
        localStorage.setItem(`otp_expiry_${email}`, expiry.toString());
    }
};

export const getOtpTimeRemaining = (email: string): number => {
    if (typeof window === 'undefined') return 0;
    const expiry = localStorage.getItem(`otp_expiry_${email}`);
    if (!expiry) return 0;
    const remaining = Math.ceil((parseInt(expiry) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
};

export const clearOtpTimer = (email: string) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(`otp_expiry_${email}`);
    }
};

export const useOtp = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const verifyAction = useCallback((email: string) => {
        if (!email) return false;
        const purpose = getOtpPurpose(email);
        const pendingReg = sessionStorage.getItem('pending_registration');
        return !!(purpose || pendingReg);
    }, []);

    const verify = async (email: string, otp: string): Promise<AuthApiResponse & { purpose?: string }> => {
        try {
            otpSchema.parse({ email, otp });
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) formattedErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(formattedErrors);
                const otpMessage = formattedErrors.otp;
                toast.error(
                    otpMessage?.includes('6')
                        ? 'OTP must be exactly 6 digits'
                        : (otpMessage || error.issues[0]?.message || 'Please fix the errors in the form')
                );
            }
            return { success: false, error: 'Validation failed' };
        }

        setIsLoading(true);
        try {
            let userData = null;
            const pendingReg = sessionStorage.getItem('pending_registration');
            if (pendingReg) userData = JSON.parse(pendingReg);

            const purpose = getOtpPurpose(email) || undefined;
            const params: VerifyOtpParams = {
                email,
                otp,
                ...(userData ? { userData } : {}),
                purpose
            };

            const result = await otpService.verify(params);

            if (result.success) {
                clearOtpTimer(email);

                if (purpose === 'reset') {
                    return { success: true, purpose: 'reset' };
                } else {
                    sessionStorage.removeItem('pending_registration');
                    clientCookies.delete('auth_action_pending');
                    
                    if (result.data?.user) {
                        const user = mapAuthUser(result.data.user);
                        dispatch(setUser(user));
                        localStorage.setItem('user', JSON.stringify(user));

                        if (result.data.accessToken) {
                            clientCookies.set('token', result.data.accessToken, 7 * 24 * 60 * 60);
                        }
                        
                        toast.success('Email verified successfully!');
                        const role = user.role?.toLowerCase();
                        if (role === 'admin') router.push(ADMIN_ROUTES.HOME);
                        else if (role === 'doctor') router.push(DOCTOR_ROUTES.DASHBOARD);
                        else router.push(PUBLIC_ROUTES.HOME);
                    }
                    return { success: true };
                }
            } else {
                toast.error(result.message || result.error || 'Invalid OTP.');
                return { success: false, error: result.error };
            }
        } catch (error) {
            logger.error('OTP verify error', error);
            toast.error('An error occurred. Please try again.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const resend = async (email: string) => {
        setIsLoading(true);
        try {
            const params: ResendOtpParams = { email };
            const result = await otpService.resend(params);
            if (result.success) {
                setOtpTimer(email);
                toast.success('OTP resent successfully!');
                return { success: true };
            } else {
                toast.error(result.message || result.error || 'Failed to resend OTP.');
                return { success: false };
            }
        } catch (error) {
            logger.error('OTP resend error', error);
            toast.error('An error occurred.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        verify,
        resend,
        verifyAction,
        isLoading,
        errors,
    };
};
