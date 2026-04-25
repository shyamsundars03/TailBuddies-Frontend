"use client"

import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import Swal from "sweetalert2"
import { useState } from "react"
import { NotificationPopover } from "../../ui/NotificationPopover"
import { cn } from "../../../../lib/utils/utils"
import { useEffect } from "react"
import { notificationApi } from "../../../../lib/api/notification.api"



export function DoctorHeader({ onChatClick }: { onChatClick?: () => void }) {
    const { user } = useAppSelector((state) => state.auth)
    const { logout } = useSignin()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const response = await notificationApi.getNotifications('unread')
            if (response.success) {
                setUnreadCount(response.notifications?.length || 0)
            }
        }
        if (user) {
            fetchUnreadCount()
            const interval = setInterval(fetchUnreadCount, 60000)
            return () => clearInterval(interval)
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
        <header className="sticky top-0 z-50 bg-blue-600 text-white px-6 py-5 flex items-center shadow-md">
            <div className="flex items-center gap-3 ml-10">
                <div className="flex items-center gap-2 ml-28">
                    <div className="mb-0">
                        <Image src="/favicon.ico" alt="TailBuddies Logo" width={50} height={70} />
                    </div>
                    <span className="font-bold text-lg">TailBuddies.</span>
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto mr-20">
                {user && (
                    <div className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-4 py-1.5 rounded-full flex items-center gap-2 transition cursor-default">
                        <User size={14} />
                        <span className="text-xs font-bold whitespace-nowrap">
                            {user?.username || "Doctor"}
                        </span>
                    </div>
                )}
                <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
                    <Search size={18} />
                </button>
                <div className="relative">
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
                                    setUnreadCount(response.notifications?.length || 0)
                                }
                            }
                            fetchUnreadCount()
                        }} />
                    )}
                </div>
                 <button 
                    onClick={onChatClick}
                    className="w-9 h-9 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition"
                >
                    <MessageSquare size={18} />
                </button>
                <button
                    onClick={handleLogout}
                    className="w-9 h-9 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    )
}
