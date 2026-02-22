// lib/hooks/auth/useOtp.ts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/authSlice';
import { verifyUser, addLog } from '../../redux/slices/demoCheckSlice';
import { otpService } from '../../services/auth/otp.service';
import logger from '../../logger/index';
import { toast } from 'sonner';
import { signToken } from '../../utils/jwt';

export const useOtp = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const verify = async (email: string, otp: string) => {
        setIsLoading(true);
        logger.info('Verifying OTP', { email, otp });
        dispatch(addLog(`CLIENT: Verifying OTP for ${email}`));

        try {
            const result = await otpService.verify({ email, otp });
            if (result.success) {
                // MOCK BACKEND UPDATE
                dispatch(verifyUser(email));
                dispatch(addLog(`MOCK_BACKEND: User ${email} verified.`));

                const user = result.data.user;
                const token = await signToken(user);

                logger.info('Verification success, generated JWT', { token });
                dispatch(addLog(`CLIENT: Verification success. JWT generated.`));

                dispatch(setUser(user));
                toast.success("Email verified successfully!");

                if (user.role === 'admin') router.push('/admin/dashboard');
                else if (user.role === 'doctor') router.push('/doctor/dashboard');
                else router.push('/');

                return { success: true };
            } else {
                toast.error(result.error || "Invalid OTP.");
                return { success: false, error: result.error };
            }
        } catch (error) {
            logger.error('OTP verify error', error);
            toast.error("An error occurred. Please try again.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const resend = async (email: string) => {
        try {
            const result = await otpService.resend(email);
            if (result.success) {
                toast.success("OTP resent successfully!");
                return { success: true };
            } else {
                toast.error(result.error || "Failed to resend OTP.");
                return { success: false };
            }
        } catch (error) {
            toast.error("An error occurred.");
            return { success: false };
        }
    };

    return {
        verify,
        resend,
        isLoading,
    };
};
