"use client"

import { Search, Bell, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import Swal from "sweetalert2"
import { useState } from "react"
import { NotificationPopover } from "../../ui/NotificationPopover"
import { cn } from "../../../../lib/utils/utils"
import { useEffect } from "react"
import { notificationApi } from "../../../../lib/api/notification.api"



export function DoctorHeader({ onChatClick: _onChatClick }: { onChatClick?: () => void }) {
    const { user } = useAppSelector((state) => state.auth)
    const { logout } = useSignin()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const response = await notificationApi.getNotifications('unread')
            if (response.success) {
                setUnreadCount(response.data?.length || 0)
            }
        }
        
        if (user) {
            fetchUnreadCount()
            
            // Listen for real-time updates from SocketHandler
            window.addEventListener('notification-received', fetchUnreadCount);
            
            const interval = setInterval(fetchUnreadCount, 60000)
            return () => {
                clearInterval(interval);
                window.removeEventListener('notification-received', fetchUnreadCount);
            }
        }
    }, [user])

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
            cancelButtonText: "No, stay"
        }).then((result) => {
            if (result.isConfirmed) {
                logout()
            }
        })
    }

    return (
        <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <Image src="/favicon.ico" alt="TailBuddies Logo" width={50} height={50} className="object-contain" />
                    </div>
                    <span className="font-bold text-base md:text-lg tracking-tight">TailBuddies.</span>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user && (
                        <div className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-2.5 py-1 md:px-4 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 transition cursor-default">
                            <User size={14} className="shrink-0" />
                            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap  hidden sm:inline">
                                {user?.username || "Doctor"}
                            </span>
                        </div>
                    )}
                    <button className="w-9 h-9 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition shrink-0">
                        <Search size={18} />
                    </button>
                    <div className="relative shrink-0">
                        <button 
                             onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                             className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center transition relative",
                                isNotificationsOpen ? "bg-white text-blue-600" : "bg-black bg-opacity-20 hover:bg-opacity-30"
                             )}
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-white">{unreadCount}</span>
                                </div>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <NotificationPopover onClose={() => {
                                setIsNotificationsOpen(false)
                                const fetchUnreadCount = async () => {
                                    const response = await notificationApi.getNotifications('unread')
                                    if (response.success) {
                                        setUnreadCount(response.data?.length || 0)
                                    }
                                }
                                fetchUnreadCount()
                            }} />
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition shrink-0"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    )
}
