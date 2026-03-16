"use client"

import { useAppSelector } from "../../../lib/redux/hooks"
import { usePathname } from "next/navigation"
import { cn } from "../../../lib/utils/utils"
import { OwnerHeader } from "../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../components/common/layout/owner/PageContainer"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAppSelector((state) => state.auth)
    const pathname = usePathname()

    // Determine active section from pathname for the sidebar highlighting
    const getActiveSection = () => {
        if (pathname.startsWith('/owner/pets')) return 'pet'
        if (pathname.startsWith('/owner/bookings')) return 'bookings'
        if (pathname.startsWith('/owner/services')) return 'services'
        if (pathname.startsWith('/owner/profile')) return 'profile'
        if (pathname.startsWith('/owner/account')) return 'account'
        return 'account'
    }

    const userData = {
        userName: user?.username || user?.email || "—",
        email: user?.email || "—",
    }

    const isServicesPage = pathname.startsWith('/owner/services')

    return (
        <div className="min-h-screen bg-gray-50">
            <OwnerHeader />
            <div className={cn(
                "max-w-7xl mx-auto px-6 py-8 flex gap-8",
                isServicesPage ? "flex-col" : "flex-row"
            )}>
                {!isServicesPage && (
                    <OwnerSidebar
                        userName={userData.userName}
                        email={userData.email}
                        activeSection={getActiveSection()}
                        onSectionChange={() => { }}
                    />
                )}
                <div className="flex-1">
                    <PageContainer>
                        {children}
                    </PageContainer>
                </div>
            </div>
        </div>
    )
}
