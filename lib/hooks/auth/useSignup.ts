import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signupService } from '../../services/auth/signup.service';
import { signupSchema, SignupFormData } from '../../validation/auth';
import logger from '../../logger';
import { toast } from 'sonner';
import { clientCookies } from '../../utils/clientCookies';
import { AUTH_ROUTES } from '../../constants/routes';

export const useSignup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (data: SignupFormData): boolean => {
    try {
      signupSchema.parse(data);
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

  const handleSubmit = async (data: SignupFormData) => {
    if (!validateForm(data)) {
      toast.error('Please fix the errors in the form');
      return { success: false };
    }

    setIsLoading(true);
    try {
      const response = await signupService.register(data);
      if (response.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_registration', JSON.stringify(data));
          clientCookies.set('auth_action_pending', 'true', 600);
        }
        toast.success('Account created! Please verify OTP.');
        router.push(`${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(data.email)}`);
        return { success: true };
      } else {
        toast.error(response.message || response.error || 'Signup failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      logger.error('Signup submission error', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errors,
    handleSubmit,
    setErrors,
  };
};