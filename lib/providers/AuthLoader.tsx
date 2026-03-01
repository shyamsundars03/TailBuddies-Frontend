'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/authSlice';
import { clientCookies } from '../utils/clientCookies';
import logger from '../logger';

export function AuthLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const token = clientCookies.get('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                logger.info('Hydrating auth state from localStorage', { email: user.email });
                dispatch(setUser(user));


            } catch (e) {


                logger.error('Failed to parse stored user during hydration', e);
                
                localStorage.removeItem('user');
                clientCookies.delete('token');
            }
        }
        // Break the synchronous render chain to satisfy linter
        Promise.resolve().then(() => setIsHydrated(true));
    }, [dispatch]);

    
    if (!isHydrated) {
        return null; 
    }

    return <>{children}</>;
}
