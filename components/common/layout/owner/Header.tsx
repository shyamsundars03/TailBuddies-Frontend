"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import { ADMIN_ROUTES, DOCTOR_ROUTES, OWNER_ROUTES, AUTH_ROUTES } from "../../../../lib/constants"
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

   const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const { logout } = useSignin()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
const userRole = user?.role?.toLowerCase()



  const servicesUrl = user
    ? userRole === "doctor"
      ? DOCTOR_ROUTES.DASHBOARD
      : userRole === "admin"
        ? ADMIN_ROUTES.HOME
        : OWNER_ROUTES.SERVICES
    : AUTH_ROUTES.SIGNIN





    useEffect(() => {
        const fetchUnreadCount = async () => {
            const response = await notificationApi.getNotifications('unread')
            if (response.success) {
                setUnreadCount(response.data?.length || 0)
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
        <header className={cn("sticky top-0 z-50 bg-yellow-400 h-20 shadow-md", className)}>
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-full flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <Image src="/favicon.ico" alt="TailBuddies Logo" width={50} height={50} className="object-contain" />
                    </div>
                    <span className="font-bold text-base md:text-lg tracking-tight text-gray-900">TailBuddies</span>
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

                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    {user && (
                        <Link href="/owner/profile" className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 transition cursor-pointer shadow-sm">
                            <User size={14} className="shrink-0" />
                            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap hidden sm:inline">
                                {user?.username || "Owner"}
                            </span>
                        </Link>
                    )}
                    <button
                      onClick={() => router.push(servicesUrl)}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition shrink-0"
                      title="Search services"
                    >
                      <Search size={18} className="text-gray-700" />
                    </button>
                    <div className="relative shrink-0">
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
                                        setUnreadCount(response.data?.length || 0)
                                    }
                                }
                                fetchUnreadCount()
                            }} />
                        )}
                    </div>
                    <button 
                        onClick={onChatClick}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition text-gray-700 shrink-0"
                    >
                        <MessageSquare size={18} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition text-gray-700 shrink-0"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    )
}
