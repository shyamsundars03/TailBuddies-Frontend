
export const clientCookies = {



    set: (name: string, value: string, maxAgeSeconds: number = 300) => {
        if (typeof window === 'undefined') return;
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${value}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
    },



    get: (name: string): string | null => {
        if (typeof window === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    },



    delete: (name: string) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }



};
