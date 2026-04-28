"use client"

import { useState } from "react"
// import { OwnerHeader } from "../../../../../components/common/layout/owner/Header"
// import { OwnerSidebar } from "../../../../../components/common/layout/owner/SideBar"
// import { PageContainer } from "../../../../../components/common/layout/owner/PageContainer"
import { ChangePasswordForm } from "../../../../../components/owner/ChangePasswordForm"
import { useAppSelector } from "../../../../../lib/redux/hooks"

import Link from "next/link"

export default function ChangePasswordPage() {
    const { user } = useAppSelector((state) => state.auth)
    const [activeSection, setActiveSection] = useState("account")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">Security</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/owner/account" className="hover:text-blue-600 transition">Account</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">Change Password</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-3xl">
                <ChangePasswordForm />
            </div>
        </div>
    )
}
