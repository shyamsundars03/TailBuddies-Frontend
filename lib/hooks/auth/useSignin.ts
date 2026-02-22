// lib/hooks/auth/useSignin.ts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, logout as logoutAction } from '../../redux/slices/authSlice';
import { signinService } from '../../services/auth/signin.service';
import type { SigninCredentials, SigninApiResponse } from '../../types/auth/signin.types';
import logger from '../../logger/index';
import { toast } from 'sonner';

import { signToken } from '../../utils/jwt';
import { signinSchema } from '../../validation/auth/signin.schema';
import { z } from 'zod';

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
                setErrors({}); // Clear errors on successful validation
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
            setErrors({}); // Clear any previous errors before API call

            logger.info('signinService.login called', { email: credentials.email });

            const response = await signinService.login(credentials);
            if (response.success && response.data?.user) {
                const token = await signToken(response.data.user);

                logger.info('Login successful, generated JWT', { token });
                dispatch(setUser(response.data.user));
                toast.success(`Welcome back, ${response.data.user.username || 'User'}!`);

                const role = response.data.user.role;
                if (role === 'ADMIN') router.push('/admin/dashboard');
                else if (role === 'DOCTOR') router.push('/doctor/dashboard');
                else router.push('/owner/dashboard');

                return response;
            } else {
                logger.warn('Login failed or unexpected response shape', { response });
                toast.error(response.error || 'Login failed - unexpected response from server');
                return response;
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        newErrors[issue.path[0].toString()] = issue.message;
                    }
                });
                setErrors(newErrors);
                return { success: false, error: 'Validation failed' };
            }
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
            // Mock google login logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUser = { id: 'google-123', email: 'google@example.com', role, username: 'Google User' };
            const token = await signToken(mockUser);

            logger.info('Google login success', { token });

            dispatch(setUser(mockUser));
            toast.success('Signed in with Google!');
            router.push('/');
            return { success: true };
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
