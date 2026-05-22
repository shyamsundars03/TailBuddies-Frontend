import { SignupParams, AuthResponseData } from '../../types/auth/auth.types';
import apiClient from '../apiClient';
import { AUTH_ENDPOINTS } from '../../endpoints/auth';
import { handleApiError } from '../../utils/api-error.handler';
import { ApiResponse } from '../../types/api.types';

export const signupApi = {
  register: async (data: SignupParams): Promise<ApiResponse<AuthResponseData>> => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.SIGNUP, data);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },
};