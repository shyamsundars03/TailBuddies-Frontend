import { signinApi, googleAuthApi } from '../../api/auth';
import logger from '../../logger';
import { SigninCredentials, AuthApiResponse } from '../../types/auth';


export const signinService = {


    login: async (credentials: SigninCredentials): Promise<AuthApiResponse> => {



        logger.info('signinService.login called', { email: credentials.email });
        return await signinApi.login(credentials);
    },



    googleLogin: async (idToken: string, role: string): Promise<AuthApiResponse> => {


        logger.info('signinService.googleLogin called', { role });
        return await googleAuthApi.login(idToken, role);
        
    },
        async logout(): Promise < { success: boolean; message?: string; error?: string } > {
            logger.info('signinService.logout called');
            return await signinApi.logout();
        },
};

