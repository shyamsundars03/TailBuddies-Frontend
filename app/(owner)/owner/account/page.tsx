"use client"

import { useState } from "react"
import { OwnerHeader } from "../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../components/common/layout/owner/PageContainer"
import { AccountForm } from "../../../../components/owner/AccountForm"
import { useAppSelector } from "../../../../lib/redux/hooks"

export default function OwnerAccountPage() {
    const { user } = useAppSelector((state) => state.auth)

    const userData = {
        userName: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "Female",
        phone: user?.phone || "",
    }

    return (
        <AccountForm initialData={userData} />
    )
}
