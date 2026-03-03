"use client"

// import { AdminHeader } from "../../../../components/common/layout/admin/Header"
// import { AdminSidebar } from "../../../../components/common/layout/admin/Sidebar"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { AdminDashboardContent } from "../../../../components/admin/AdminDashboardContent"

export default function AdminDashboard() {
    return (
        <>

        <AdminPageContainer title="Dashboard" activeItem="dashboard">
            <AdminDashboardContent />
        </AdminPageContainer>
    </>
    )
}
