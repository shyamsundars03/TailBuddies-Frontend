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
    const [activeSection, setActiveSection] = useState("profile")

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
        <div className="min-h-screen bg-gray-50">
            <OwnerHeader />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
                <OwnerSidebar
                    userName={userData.userName}
                    email={userData.email}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <div className="flex-1">
                    <PageContainer>
                        <AccountForm initialData={userData} isReadOnly={true} />
                    </PageContainer>
                </div>
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
