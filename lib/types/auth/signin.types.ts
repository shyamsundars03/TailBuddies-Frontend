import { AuthApiResponse } from './common.types';

export interface SigninCredentials {
    email: string;
    password?: string;
    role: 'owner' | 'doctor' | 'admin';
}

export type SigninApiResponse = AuthApiResponse;

