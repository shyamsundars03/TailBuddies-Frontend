"use client"

import { useState } from "react"
import { OwnerHeader } from "../../../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../../../components/common/layout/owner/PageContainer"
import { ChangeEmailForm } from "../../../../../components/owner/ChangeEmailForm"
import { useAppSelector } from "../../../../../lib/redux/hooks"

export default function ChangeEmailPage() {
    return (
        <ChangeEmailForm />
    )
}
