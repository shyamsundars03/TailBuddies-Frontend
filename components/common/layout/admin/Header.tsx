"use client"
//Search, Bell, MessageSquare,
import { User, LogOut } from "lucide-react"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import Swal from "sweetalert2"
import Image from "next/image"

interface AdminHeaderProps {
    title?: string
}

export function AdminHeader({ title: _title }: AdminHeaderProps) {
    const { user } = useAppSelector((state) => state.auth)
    const { logout } = useSignin()

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
        <header className="sticky top-0 z-50 bg-[#605f5f] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Image src="/favicon.ico" alt="TailBuddies Logo" width={50} height={70} />
                        </div>
                        <span className="font-bold text-base md:text-lg tracking-tight">TailBuddies</span>
                    </div>
                </div>

                {/* Right Side: Role & Profile */}
                <div className="flex items-center gap-2 md:gap-4">
                    {user && (
                        <div className="bg-yellow-400 text-black px-2 py-1 md:px-4 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 transition cursor-default shadow-sm">
                            <User size={12} className="md:w-[14px] md:h-[14px]" />
                            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">
                                {user?.username || "Admin"}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition text-white shrink-0"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    )
}
