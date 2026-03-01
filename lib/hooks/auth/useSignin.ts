

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, logout as logoutAction } from '../../redux/slices/authSlice';
import { signinService } from '../../services/auth/signin.service';
import type { SigninCredentials, SigninApiResponse } from '../../types/auth/signin.types';
import logger from '../../logger/index';
import { toast } from 'sonner';

import { signinSchema } from '../../validation/auth/signin.schema';
import { z } from 'zod';
import { clientCookies } from '../../utils/clientCookies';


export const useSignin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const dispatch = useAppDispatch();







    const login = async (credentials: SigninCredentials): Promise<SigninApiResponse> => {



        const validateForm = (data: SigninCredentials): boolean => {
            try {


                logger.debug('Validating signin form data', data);
                signinSchema.parse(data);


                setErrors({}); 



                return true;
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const formattedErrors: Record<string, string> = {};
                    error.issues.forEach((issue) => {
                        if (issue.path[0]) {
                            formattedErrors[issue.path[0] as string] = issue.message;
                        }
                    });
                    setErrors(formattedErrors);
                }
                return false;
            }
        };



        try {
            if (!validateForm(credentials)) {
                logger.warn('Signin form validation failed');
                return { success: false, error: 'Validation failed' };
            }

            setIsLoading(true);
            setErrors({}); 

            logger.info('signinService.login called', { email: credentials.email });

            const response = await signinService.login(credentials);
            if (response.success && response.data?.user) {
                dispatch(setUser(response.data.user));
                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60); // 7 days
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                toast.success(`Welcome back, ${response.data.user.username || 'User'}!`);




                const role = response.data.user.role?.toLowerCase();
                if (role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (role === 'doctor') {
                    router.push('/doctor/dashboard');
                } else {
                    router.push('/home'); 
                }




                return response;
            } else {
                logger.warn('Login failed or unexpected response shape', { response });
                toast.error(response.error || 'Login failed - unexpected response from server');
                return response;
            }
        } catch (error: unknown) {
            logger.error('Signin submission error', error);
            toast.error('An unexpected error occurred');
            return { success: false, error: 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };







    const googleLogin = async (credential: string, role: string) => {


        setIsLoading(true);
        logger.info('Google login attempt', { role });



        try {
            const response = await signinService.googleLogin(credential, role);
            if (response.success && response.data?.user) {
                dispatch(setUser(response.data.user));
                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60); 
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                toast.success('Signed in with Google!');

                const userRole = response.data.user.role?.toLowerCase();




                if (userRole === 'admin') router.push('/admin/dashboard');
                else if (userRole === 'doctor') router.push('/doctor/dashboard');
                else router.push('/home');



                
                return { success: true };
            } else {
                logger.warn('Google login failed', { response });
                toast.error(response.error || 'Google sign in failed');
                return { success: false };
            }





        } catch (error) {
            logger.error('Google login error', error);
            toast.error('Google sign in failed');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        logger.info('Logging out');
        clientCookies.delete('token');
        localStorage.removeItem('user');
        dispatch(logoutAction());
        router.push('/signin');
    };

    return {
        login,
        googleLogin,
        logout,
        isLoading,
        errors,
        setErrors,
    };
};
