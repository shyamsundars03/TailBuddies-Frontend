import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { clientCookies } from '../utils/clientCookies';
import { chatApi } from '../api/chat.api';

interface Message {
    senderId: string;
    senderRole: 'owner' | 'doctor';
    message: string;
    timestamp: Date;
}

export const useConsultation = (appointmentId: string, userId: string, userRole: 'owner' | 'doctor') => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!appointmentId) return;

        // Fetch past messages from the database
        const fetchHistory = async () => {
            const res = await chatApi.getChatHistory(appointmentId);
            if (res.success && Array.isArray(res.data)) {
                // Map database messages to the required Message interface
                const history = res.data.map((m: any) => ({
                    senderId: m.senderId,
                    senderRole: m.senderRole,
                    message: m.message,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(history);
            }
        };

        fetchHistory();

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const SOCKET_URL = API_URL.replace(/\/api$/, '');
        
        if (!socketRef.current) {
            console.log('Initializing socket connection to:', SOCKET_URL);
            const token = clientCookies.get('token');
            const socketInstance = io(SOCKET_URL, {
                path: '/socket.io',
                auth: { token },
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => {
                console.log('Socket connected successfully');
                setIsConnected(true);
                setError(null);
                socketInstance.emit('join-room', appointmentId);
            });

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
                setError(`Connection failed: ${err.message}`);
                setIsConnected(false);
            });

            socketInstance.on('receive-message', (message: Message) => {
                setMessages((prev) => [...prev, message]);
            });

            socketInstance.on('error', (err: { message: string }) => {
                console.error('Socket error event:', err.message);
                setError(err.message);
            });

            socketInstance.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
            });

            socketRef.current = socketInstance;
            setSocket(socketInstance);
        }

        return () => {
            if (socketRef.current) {
                console.log('Disconnecting socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
        };
    }, [appointmentId]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('send-message', {
                appointmentId,
                senderId: userId,
                senderRole: userRole,
                message,
            });
        } else {
            console.warn('Cannot send message: socket not connected');
        }
    }, [appointmentId, userId, userRole, isConnected]);

    return {
        socket,
        messages,
        sendMessage,
        error,
        setError,
        isConnected
    };
};
