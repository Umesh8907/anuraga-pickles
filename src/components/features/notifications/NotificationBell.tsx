'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react'
import { useSocket } from '@/providers/SocketProvider'
import { useUser } from '@/hooks/useAuth'
import { getMyNotifications, markAsRead, markAllAsRead } from '@/services/notification.service'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const { socket } = useSocket();
    const { data: user } = useUser();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications on mount
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const res = await getMyNotifications();
                if (res.success) {
                    setNotifications(res.data);
                    setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    // Socket Listener for new notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.on('notification', handleNewNotification);

        return () => {
            socket.off('notification', handleNewNotification);
        };
    }, [socket]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors rounded-full hover:bg-stone-50"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                        <h3 className="font-bold text-stone-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
                            >
                                <CheckCheck className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-8 text-stone-400">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-stone-500 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={cn(
                                            "p-4 transition-colors hover:bg-stone-50 relative group",
                                            !notification.isRead && "bg-amber-50/30"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={cn(
                                                        "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                        notification.type === 'ORDER' ? "bg-blue-100 text-blue-700" :
                                                            notification.type === 'INVENTORY' ? "bg-red-100 text-red-700" :
                                                                "bg-stone-100 text-stone-700"
                                                    )}>
                                                        {notification.type}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm text-stone-900 mb-0.5">{notification.title}</h4>
                                                <p className="text-sm text-stone-600 leading-snug mb-2">{notification.message}</p>

                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            if (!notification.isRead) handleMarkAsRead(notification._id);
                                                        }}
                                                        className="text-xs font-bold text-amber-700 hover:underline"
                                                    >
                                                        View details &rarr;
                                                    </Link>
                                                )}
                                            </div>

                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-stone-300 hover:text-green-600 hover:bg-green-50 transition-colors shrink-0"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
