"use client"

import { Suspense, useEffect, useState } from "react"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import { OwnerHeader } from "../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../components/common/layout/owner/PageContainer"
import { AccountForm } from "../../../../components/owner/AccountForm"

function OwnerProfileInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (user && user.role?.toLowerCase() !== "owner") {
            router.replace("/signin")
        }
    }, [user, router])

    const userData = {
        userName: user?.username || "—",
        gender: user?.gender || "Female",
        email: user?.email || "—",
        phone: user?.phone || "",
    }

    return (
        <AccountForm initialData={userData} isReadOnly={true} />
    )
}

export default function OwnerProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>}>
            <OwnerProfileInner />
        </Suspense>
    )
}
