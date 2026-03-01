// app/(owner)/owner/profile/page.tsx
"use client"

import { Suspense, useEffect } from "react"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ProfileView } from "../../../../components/owner/ProfileView"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"

function OwnerProfileInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const { logout } = useSignin()

    useEffect(() => {
        if (user && user.role?.toLowerCase() !== "owner") {
            router.replace("/signin")
        }
    }, [user, router])

    // for profile data
    const profileData = {
        userName: user?.username || "—",
        gender: "—",          
        email: user?.email || "—",
        phone: "—",           
        isActive: true,
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Owner Header */}
            <header className="bg-yellow-400 px-8 py-4 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-40 rounded-full flex items-center justify-center text-lg">
                        🐾
                    </div>
                    <h1 className="font-bold text-lg text-gray-900">TailBuddies</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">Hi, {user?.username || "Owner"}!</span>
                    <button
                        onClick={logout}
                        className="px-4 py-1.5 bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 text-sm rounded-lg transition font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-56 min-h-screen bg-white shadow-lg pt-6">
                    <nav className="space-y-1 px-3">
                        {[
                            { label: "Profile", href: "/owner/profile", active: true },
                            { label: "Account", href: "/owner/account", active: false },
                            { label: "My Pets", href: "/owner/pets", active: false },
                            { label: "Appointments", href: "/owner/appointments", active: false },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${item.active
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <ProfileView data={profileData} />
                </main>
            </div>
        </div>
    )
}

export default function OwnerProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>}>
            <OwnerProfileInner />
        </Suspense>
    )
}
