
"use client"

import { Suspense } from "react"
import { AdminDashboardContent } from "../../../../components/admin/AdminDashboardContent"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"

function AdminDashboardInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const { logout } = useSignin()


    useEffect(() => {
        if (user && user.role?.toLowerCase() !== "admin") {
            router.replace("/admin/signin")
        }
    }, [user, router])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Top Bar */}
            <header className="bg-red-600 text-white px-8 py-4 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">A</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">TailBuddies Admin</h1>
                        <p className="text-red-200 text-xs">Administrator Panel</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-red-100">Welcome, {user?.username || "Admin"}</span>
                    <button
                        onClick={logout}
                        className="px-4 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition"
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
                            { label: "Dashboard", active: true },
                            { label: "Doctors", active: false },
                            { label: "Patients", active: false },
                            { label: "Appointments", active: false },
                            { label: "Clinics", active: false },
                            { label: "Reports", active: false },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${item.active
                                    ? "bg-red-50 text-red-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Admin!</h2>
                        <p className="text-gray-500 text-sm">Dashboard Overview</p>
                    </div>
                    <AdminDashboardContent />
                </main>
            </div>
        </div>
    )
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>}>
            <AdminDashboardInner />
        </Suspense>
    )
}
