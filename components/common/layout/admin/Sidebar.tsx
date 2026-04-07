"use client"

import React, { memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    UserCheck,
    PawPrint,
    Stethoscope,
    Receipt,
    CalendarCheck,
    ArrowLeftRight,
    CreditCard,
    MessageSquare,
    Star,
    BarChart3,
    LogOut,
    ChevronRight,
    User,
    type LucideIcon
} from "lucide-react"
import { cn } from "../../../../lib/utils/utils"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import { useAppSelector } from "../../../../lib/redux/hooks"
import Swal from "sweetalert2"

interface AdminSidebarProps {
    onItemClick?: (id: string) => void
    className?: string
    activeItem?: string
}

interface SidebarMenuItem {
    icon: LucideIcon
    label: string
    id: string
    href: string
    badge?: boolean
}

const menuItems: SidebarMenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Users", id: "users", href: "/admin/usersManagement" },
    { icon: UserCheck, label: "Doctors Verifications", id: "doctors", href: "/admin/doctorVerifications" },
    { icon: PawPrint, label: "Pets", id: "pets", href: "/admin/petsManagement" },
    { icon: Stethoscope, label: "Speacilities", id: "specialities", href: "/admin/specialitiesManagement" },
    { icon: Receipt, label: "Subscription", id: "subscriptions", href: "#" },
    { icon: CalendarCheck, label: "Appointments", id: "appointments", href: "/admin/appointmentManagement" },
    { icon: ArrowLeftRight, label: "Transactions", id: "transactions", href: "/admin/transactionManagement" },
    { icon: CreditCard, label: "Payments", id: "payments", href: "#" },
    { icon: MessageSquare, label: "Chat Assistant", id: "chat", href: "/admin/chatAssistant" },
    { icon: Star, label: "Reviews", id: "reviews", href: "#" },
    { icon: BarChart3, label: "Report", id: "reports", href: "#" },
]

export const AdminSidebar = memo(function AdminSidebar({ onItemClick, className, activeItem }: AdminSidebarProps) {
    const pathname = usePathname()
    const { logout } = useSignin()
    const { user } = useAppSelector((state) => state.auth)

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
        <div className={cn("w-80 shrink-0", className)}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                {/* Admin Profile Header (Grey Section) */}
                <div className="bg-linear-to-br from-[#828282] to-[#606060] p-6 relative">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center mb-3 overflow-hidden">
                            <User size={32} className="text-white/60" />
                        </div>
                        <h3 className="text-white font-bold text-lg">{user?.username || "Admin User"}</h3>
                        <p className="text-white/60 text-xs font-medium tracking-wide">SYSTEM ADMINISTRATOR</p>
                    </div>
                </div>

                {/* Navigation Menus */}
                <div className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || activeItem === item.id

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => onItemClick?.(item.id)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={14} className="text-blue-400" />}
                            </Link>
                        )
                    })}

                    {/* Logout */}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                            <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})
