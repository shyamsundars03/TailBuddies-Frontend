import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { clientCookies } from '../utils/clientCookies';

export const useSocket = (userId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const SOCKET_URL = API_URL.replace(/\/api$/, '');
        
        if (!socketRef.current) {
            const token = clientCookies.get('token');
            const socketInstance = io(SOCKET_URL, {
                path: '/socket.io',
                auth: { token },
                withCredentials: true,
                transports: ['websocket', 'polling'],
            });

            socketInstance.on('connect', () => {
                console.log('Global socket connected');
            });

            socketRef.current = socketInstance;
            setSocket(socketInstance);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, [userId]);

    return socket;
};
