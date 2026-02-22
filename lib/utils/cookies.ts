// lib/utils/cookies.ts

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
    (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function removeAuthCookie() {
    (await cookies()).delete('token');
}

export async function getAuthCookie() {
    return (await cookies()).get('token')?.value;
}
