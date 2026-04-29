"use client"

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useSocket } from "@/lib/hooks/useSocket";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import React from "react";

export function NotificationSocketHandler() {
    const { user } = useAppSelector((state) => state.auth);
    const socket = useSocket(user?.id ?? undefined);

    useEffect(() => {
        if (socket) {
            socket.on('new_notification', (notification: any) => {
                console.log('New notification received via socket:', notification);
                
                // Show toast alert
                toast.info(notification.title || "New Update", {
                    description: notification.message,
                    icon: <Bell className="h-4 w-4" />,
                    duration: 5000,
                    action: {
                        label: "View",
                        onClick: () => {
                            if (notification.link) window.location.href = notification.link;
                        }
                    }
                });

                // Dispatch event to update unread count in header
                window.dispatchEvent(new CustomEvent('notification-received'));
            });

            return () => {
                socket.off('new_notification');
            };
        }
    }, [socket]);

    return null;
}
