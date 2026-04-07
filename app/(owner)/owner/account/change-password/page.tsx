"use client"

import { useState } from "react"
import { OwnerHeader } from "../../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../../components/common/layout/owner/PageContainer"
import { ChangePasswordForm } from "../../../../../components/owner/ChangePasswordForm"
import { useAppSelector } from "../../../../../lib/redux/hooks"

export default function ChangePasswordPage() {
    const { user } = useAppSelector((state) => state.auth)
    const [activeSection, setActiveSection] = useState("account")

    return (
        <div className="min-h-screen bg-gray-50">
            <OwnerHeader />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
                <OwnerSidebar
                    username={user?.username || ""}
                    email={user?.email || ""}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <div className="flex-1">
                    <PageContainer>
                        <ChangePasswordForm />
                    </PageContainer>
                </div>
            </div>
        </div>
    )
}
