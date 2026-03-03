"use client"

import { useState } from "react"
import { OwnerHeader } from "../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../components/common/layout/owner/PageContainer"
import { AccountForm } from "../../../../components/owner/AccountForm"
import { useAppSelector } from "../../../../lib/redux/hooks"

export default function OwnerAccountPage() {
    const { user } = useAppSelector((state) => state.auth)
    const [activeSection, setActiveSection] = useState("account")

    const userData = {
        userName: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "Female",
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
                        <AccountForm initialData={userData} />
                    </PageContainer>
                </div>
            </div>
        </div>
    )
}
