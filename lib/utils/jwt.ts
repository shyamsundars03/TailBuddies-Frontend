


import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret-for-demo-only';
const key = new TextEncoder().encode(JWT_SECRET);




export async function signToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch {
        return null;
    }

}
