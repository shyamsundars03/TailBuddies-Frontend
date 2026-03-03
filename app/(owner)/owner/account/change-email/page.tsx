"use client"

import { useState } from "react"
import { OwnerHeader } from "../../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../../components/common/layout/owner/PageContainer"
import { ChangeEmailForm } from "../../../../../components/owner/ChangeEmailForm"
import { useAppSelector } from "../../../../../lib/redux/hooks"

export default function ChangeEmailPage() {
    const { user } = useAppSelector((state) => state.auth)
    const [activeSection, setActiveSection] = useState("account")

    return (
        <div className="min-h-screen bg-gray-50">
            <OwnerHeader />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
                <OwnerSidebar
                    userName={user?.userName || ""}
                    email={user?.email || ""}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <div className="flex-1">
                    <PageContainer>
                        <ChangeEmailForm />
                    </PageContainer>
                </div>
            </div>
        </div>
    )
}
