import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { clientCookies } from '../utils/clientCookies';
import { SOCKET_BASE_URL } from '../constants/api';

export const useSocket = (userId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const SOCKET_URL = SOCKET_BASE_URL;

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
                setIsConnected(true);
                setSocket(socketInstance);
            });

            socketInstance.on('disconnect', () => {
                setIsConnected(false);
            });

            socketRef.current = socketInstance;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
        };
    }, [userId]);

    return { socket, isConnected };
};
