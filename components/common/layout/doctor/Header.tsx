"use client"

import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import Swal from "sweetalert2"



export function DoctorHeader() {
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
                            {user.userName || user.email}
                        </span>
                    </div>
                )}
                <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
                    <Search size={18} />
                </button>
                <button className="w-9 h-9 bg-black bg-opacity-100 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
                    <Bell size={18} />
                </button>
                <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
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
