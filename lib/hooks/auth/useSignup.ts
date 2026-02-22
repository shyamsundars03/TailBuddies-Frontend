// lib/hooks/auth/useSignup.ts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signupService } from '../../services/auth/signup.service';
import { signupSchema } from '../../validation/auth/signup.schema';
import type { SignupFormData, SignupFormErrors } from '../../types/auth/signup.types';
import logger from '../../logger';
import { toast } from 'sonner';
import { useAppDispatch } from '../../redux/hooks';
import { signToken } from '../../utils/jwt';

export const useSignup = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});

  const validateForm = (data: SignupFormData): boolean => {
    try {
      logger.debug('Validating signup form data', data);
      signupSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: SignupFormErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            formattedErrors[issue.path[0] as keyof SignupFormErrors] = issue.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (data: SignupFormData) => {
    logger.info('Signup form submission started', { email: data.email });

    if (!validateForm(data)) {
      logger.warn('Signup form validation failed', errors);
      toast.error('Please fix the errors in the form');
      return { success: false };
    }

    setIsLoading(true);

    try {
      const response = await signupService.register(data);

      if (response.success) {
        logger.info('Signup successful', { email: data.email });

        toast.success('Account created! Please verify OTP.');
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        return { success: true };
      } else {
        logger.warn('Signup failed', { error: response.error });
        toast.error(response.error || 'Signup failed');
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