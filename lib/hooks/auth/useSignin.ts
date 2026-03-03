
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, logout as logoutAction } from '../../redux/slices/authSlice';
import { signinService } from '../../services/auth/signin.service';
import type { SigninCredentials, SigninApiResponse } from '../../types/auth/signin.types';
import logger from '../../logger';
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
                const apiUser = response.data.user;
                const userToStore = {
                    id: apiUser.id,
                    email: apiUser.email,
                    role: apiUser.role,
                    username: apiUser.userName,
                    googleId: apiUser.googleId,
                    profilePic: apiUser.profilePic,
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                };
                dispatch(setUser(userToStore));

                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60); // 7 days
                    localStorage.setItem('user', JSON.stringify(userToStore));
                }
                toast.success(`Welcome back, ${userToStore.username || 'User'}!`);

                const role = apiUser.role?.toLowerCase();
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
                const apiUser = response.data.user;
                const userToStore = {
                    id: apiUser.id,
                    email: apiUser.email,
                    role: apiUser.role,
                    username: apiUser.userName,
                    googleId: apiUser.googleId,
                    profilePic: apiUser.profilePic,
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                };
                dispatch(setUser(userToStore));

                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60);
                    localStorage.setItem('user', JSON.stringify(userToStore));
                }
                toast.success('Signed in with Google!');

                const userRole = apiUser.role?.toLowerCase();
                if (userRole === 'admin') router.push('/admin/dashboard');
                else if (userRole === 'doctor') router.push('/doctor/dashboard');
                else router.push('/home');

                return response;
            } else {
                logger.warn('Google login failed', { response });
                toast.error(response.error || 'Google sign in failed');
                return response;
            }
        } catch (error) {
            logger.error('Google login error', error);
            toast.error('Google sign in failed');
            return { success: false, error: 'Google login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {




        logger.info('Logging out');

    const userStr = localStorage.getItem('user');
    let userRole = null;


        clientCookies.delete('token');
    localStorage.removeItem('user');
    dispatch(logoutAction());

    
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userRole = user.role?.toLowerCase();
        } catch (e) {
            logger.error('Failed to parse user from localStorage', e);
        }
    }
    
    // Redirect based on role
    if (userRole === 'admin') {
        router.push('/admin/signin');
    } else {
        router.push('/signin');
    }
    
    toast.success('Logged Out Successfully!!');
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
