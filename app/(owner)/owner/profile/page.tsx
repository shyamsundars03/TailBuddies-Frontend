"use client"

import { Suspense, useEffect, useState } from "react"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import { OwnerHeader } from "../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../components/common/layout/owner/PageContainer"
import { AccountForm } from "../../../../components/owner/AccountForm"

import Link from "next/link"

function OwnerProfileInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (user && user.role?.toLowerCase() !== "owner") {
            router.replace("/signin")
        }
    }, [user, router])

    const userData = {
        username: user?.username || "—",
        gender: user?.gender || "Female",
        email: user?.email || "—",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "",
        pincode: user?.pincode || "",
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Profile</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">Profile View</span>
                    </nav>
                </div>
            </div>
            <AccountForm initialData={userData} isReadOnly={true} />
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
