'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { data: user } = useUser();

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Initialize Socket
        // Use environment variable for URL if available, else standard localhost
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

        // We need to get the token. Since useUser uses a query, we might need to get token from storage 
        // or ensure the user object has it. usually auth persistence is in localStorage/cookies.
        // Assuming we can get it from localStorage for now as is common, 
        // OR if the auth hooks provide it.
        // If the 'user' object doesn't have the token, we might need a separate way to get it.
        // Let's safe check localStorage 'token' or 'accessToken'.

        const token = localStorage.getItem('accessToken');

        if (!token) return;

        const socketInstance = io(socketUrl, {
            auth: {
                token: token
            }
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        // Global Notification Listener
        socketInstance.on('notification', (data: any) => {
            // Play sound?
            // Show Toast
            toast(data.title, {
                description: data.message,
                action: data.link ? {
                    label: 'View',
                    onClick: () => window.location.href = data.link
                } : undefined
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, [user]); // Re-run if user changes (login/logout)

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
