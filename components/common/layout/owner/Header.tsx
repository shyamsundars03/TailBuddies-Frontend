"use client"

import Link from "next/link"
import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useState, useEffect } from "react"
import { NotificationPopover } from "../../ui/NotificationPopover"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import Swal from "sweetalert2"
import { cn } from "../../../../lib/utils/utils"
import { notificationApi } from "../../../../lib/api/notification.api"

export interface OwnerHeaderProps {
    className?: string
    onChatClick?: () => void
}

export function OwnerHeader({ className, onChatClick }: OwnerHeaderProps) {
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
            // Poll every minute
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
        <header className={`sticky top-0 z-50 bg-yellow-400 px-6 py-0 flex items-center justify-between pl-40 pr-40 h-20 ${className || ""}`}>
            <div className="flex items-center gap-2">
                <div className="mb-0">
                    <Image src="/favicon.ico" alt="TailBuddies Logo" width={100} height={70} />
                </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm ml-auto">
                <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                    Home
                </Link>
                <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                    About
                </Link>
                <Link href="/owner/services" className="text-gray-700 hover:text-gray-900 font-medium">
                    Services
                </Link>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                    Contacts
                </a>
            </nav>

            <div className="flex items-center gap-3 ml-auto">
                {user && (
                    <Link href="/owner/profile" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-sm mr-4">
                        <User size={14} />
                        <span className="text-xs font-bold whitespace-nowrap">
                            {user?.username || "Owner"}
                        </span>
                    </Link>
                )}
                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
                    <Search size={18} className="text-gray-700" />
                </button>
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center shadow hover:shadow-md transition relative",
                            isNotificationsOpen ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                        )}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white">{unreadCount}</span>
                            </div>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <NotificationPopover onClose={() => {
                            setIsNotificationsOpen(false)
                            // Refresh count when closed
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
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition text-gray-700"
                >
                    <MessageSquare size={18} />
                </button>
                <button
                    onClick={handleLogout}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition text-gray-700"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    )
}
