import { signupApi } from '../../api/auth/signup.api';
import { SignupParams, AuthResponseData } from '../../types/auth/auth.types';
import { ApiResponse } from '../../types/api.types';

type SignupFormData = SignupParams & { confirmPassword?: string };

export const signupService = {

  register: async (formData: SignupFormData): Promise<ApiResponse<AuthResponseData>> => {
    const { confirmPassword: _confirmPassword, ...signupData } = formData;
    return await signupApi.register(signupData as SignupParams);
  },

};