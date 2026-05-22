import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, logout as logoutAction } from '../../redux/slices/authSlice';
import { signinService } from '../../services/auth/signin.service';
import { LoginParams, AuthApiResponse, GoogleLoginParams } from '../../types/auth/auth.types';
import logger from '../../logger';
import { toast } from 'sonner';
import { signinSchema } from '../../validation/auth';
import { z } from 'zod';
import { clientCookies } from '../../utils/clientCookies';
import { ADMIN_ROUTES, DOCTOR_ROUTES, PUBLIC_ROUTES, AUTH_ROUTES } from '../../constants/routes';

export const useSignin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const dispatch = useAppDispatch();

    const validateForm = (data: LoginParams): boolean => {
        try {
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

    const login = async (credentials: LoginParams): Promise<AuthApiResponse> => {
        try {
            if (!validateForm(credentials)) {
                return { success: false, error: 'Validation failed' };
            }

            setIsLoading(true);
            setErrors({});

            const response = await signinService.login(credentials);
            if (response.success && response.data?.user) {
                const user = response.data.user;
                dispatch(setUser(user));

                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60);
                    localStorage.setItem('user', JSON.stringify(user));
                }
                toast.success(`Welcome back, ${user.username || 'User'}!`);

                const role = user.role?.toLowerCase();
                setTimeout(() => {
                    if (role === 'admin') router.push(ADMIN_ROUTES.HOME);
                    else if (role === 'doctor') router.push(DOCTOR_ROUTES.DASHBOARD);
                    else router.push(PUBLIC_ROUTES.HOME);
                }, 500);

                return response;
            } else {
                toast.error(response.message || response.error || 'Login failed');
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

    const googleLogin = async (params: GoogleLoginParams) => {
        setIsLoading(true);
        try {
            const response = await signinService.googleLogin(params);
            if (response.success && response.data?.user) {
                const user = response.data.user;
                dispatch(setUser(user));

                const token = response.data.accessToken;
                if (token) {
                    clientCookies.set('token', token, 7 * 24 * 60 * 60);
                    localStorage.setItem('user', JSON.stringify(user));
                }
                toast.success('Signed in with Google!');

                const userRole = user.role?.toLowerCase();
                if (userRole === 'admin') router.push(ADMIN_ROUTES.HOME);
                else if (userRole === 'doctor') router.push(DOCTOR_ROUTES.DASHBOARD);
                else router.push(PUBLIC_ROUTES.HOME);

                return response;
            } else {
                toast.error(response.message || response.error || 'Google sign in failed');
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

    const logout = async () => {
        const userStr = localStorage.getItem('user');
        let userRole = null;

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userRole = user.role?.toLowerCase();
            } catch (e) {
                logger.error('Failed to parse user from localStorage', e);
            }
        }

        try {
            await signinService.logout();
        } catch (error) {
            logger.error('Backend logout failed', error);
        } finally {
            clientCookies.delete('token');
            localStorage.removeItem('user');
            dispatch(logoutAction());

            if (userRole === 'admin') router.push(ADMIN_ROUTES.SIGNIN);
            else router.push(AUTH_ROUTES.SIGNIN);

            toast.success('Logged Out Successfully!!');
        }
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
