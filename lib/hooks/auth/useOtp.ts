import { useState, useCallback } from 'react';
import { clientCookies } from '../../utils/clientCookies';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/authSlice';
import { otpService } from '../../services/auth/otp.service';
import logger from '../../logger/index';
import { toast } from 'sonner';









function getOtpPurpose(email: string): string | null {
    if (typeof window === 'undefined' || !email) return null;
    const normalizedEmail = email.toLowerCase();
    const sessionPurpose = sessionStorage.getItem(`otp_purpose_${normalizedEmail}`);
    if (sessionPurpose) return sessionPurpose;

    // Fallback to URL search params
    const params = new URLSearchParams(window.location.search);
    const urlPurpose = params.get('purpose');
    logger.debug('getOtpPurpose check', { email, normalizedEmail, sessionPurpose, urlPurpose });
    return urlPurpose;
}



// function clearOtpPurpose(email: string) {
//     if (typeof window !== 'undefined') {
//         sessionStorage.removeItem(`otp_purpose_${email}`);
//     }
// }


const TIMER_DURATION = 75;


//helpers for the otp functionalities....



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

    //Action Verification: purpose finding.

    const verifyAction = useCallback((email: string) => {
        if (!email) return false;
        const purpose = getOtpPurpose(email);
        const pendingReg = sessionStorage.getItem('pending_registration');



        if (!purpose && !pendingReg) {
            return false;
        }
        return true;
    }, []);






    const verify = async (email: string, otp: string, enteredOtp?: string) => {
        setIsLoading(true);



        logger.info('Verifying OTP', { email });

        try {

            let userData = null;


            const pendingReg = sessionStorage.getItem('pending_registration');

            if (pendingReg) {
                userData = JSON.parse(pendingReg);
            }

            const purpose = getOtpPurpose(email) || undefined;
            const result = await otpService.verify({ email, otp, userData, purpose });

            if (result.success) {


                logger.info('OTP Verification Success', { email, purpose });


                clearOtpTimer(email);


                if (purpose === 'reset') {
                    logger.info('OTP purpose is reset, returning for client-side redirection', { email });
                    return { success: true, purpose: 'reset' };
                } else {
                    sessionStorage.removeItem('pending_registration');
                    clientCookies.delete('auth_action_pending');
                    const apiUserData = result.data?.user;
                    const accessToken = result.data?.accessToken;

                    if (apiUserData) {
                        const user = {
                            id: apiUserData.id,
                            email: apiUserData.email,
                            role: apiUserData.role,
                            username: apiUserData.userName || null,
                        };
                        dispatch(setUser(user));
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    if (accessToken) {
                        clientCookies.set('token', accessToken, 7 * 24 * 60 * 60);
                    }



                    toast.success('Email verified successfully!');




                    const role = apiUserData?.role?.toLowerCase();
                    if (role === 'admin') router.push('/admin/dashboard');
                    else if (role === 'doctor') router.push('/doctor/dashboard');
                    else router.push('/home');

                    return { success: true };
                }
            } else {
                toast.error(result.error || 'Invalid OTP.');
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
        try {
            const result = await otpService.resend(email);
            if (result.success) {
                setOtpTimer(email);


                toast.success('OTP resent successfully!');



                return { success: true };
            } else {
                toast.error(result.error || 'Failed to resend OTP.');
                return { success: false };
            }
        } catch {
            toast.error('An error occurred.');
            return { success: false };
        }
    };

    return {
        verify,
        resend,
        verifyAction,
        isLoading,
    };
};
