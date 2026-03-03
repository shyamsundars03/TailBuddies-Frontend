

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientCookies } from '../../utils/clientCookies';
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




                if (typeof window !== 'undefined') {
                    sessionStorage.setItem(`otp_purpose_${email}`, 'reset');
                    clientCookies.set('auth_action_pending', 'true', 600);
                }


                toast.success("Please check your email for the OTP.");




                router.push(`/verify-otp?email=${encodeURIComponent(email)}&purpose=reset`);
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









    const resetPassword = async (data: unknown) => {

        setIsLoading(true);
        logger.info('Reset password attempt');



        try {
            const result = await passwordService.reset(data);
            if (result.success) {
                clientCookies.delete('auth_action_pending');


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
