"use client"

import { useAppSelector } from "../../../lib/redux/hooks"
import { usePathname } from "next/navigation"
import { cn } from "../../../lib/utils/utils"
import { OwnerHeader } from "../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../components/common/layout/owner/PageContainer"
import { AiAssistant } from "../../../components/common/AiAssistant"
import { Bot, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAppSelector((state) => state.auth)
    const pathname = usePathname()

    // Determine active section from pathname for the sidebar highlighting
    const getActiveSection = () => {
        if (pathname.startsWith('/owner/pets')) return 'pet'
        if (pathname.startsWith('/owner/bookings')) return 'bookings'
        if (pathname.startsWith('/owner/services')) return 'services'
        if (pathname.startsWith('/owner/medical-records')) return 'medical'
        if (pathname.startsWith('/owner/calendar')) return 'calendar'
        if (pathname.startsWith('/owner/subscriptions')) return 'subscription'
        if (pathname.startsWith('/owner/chat')) return 'chat'
        if (pathname.startsWith('/owner/profile')) return 'profile'
        if (pathname.startsWith('/owner/account')) return 'account'
        return 'account'
    }

    const userData = {
        username: user?.username || user?.email || "—",
        email: user?.email || "—",
    }

    const isServicesPage = pathname.startsWith('/owner/services')
    const isVideoCall = pathname.includes('/video-call/')

    // Excluded routes for AI Assistant
    const isExcludedRoute = 
        pathname.includes('/success') || 
        pathname.includes('/failed') || 
        pathname.includes('/book/')

    const [isAiOpen, setIsAiOpen] = useState(false)
    const [isAiMinimized, setIsAiMinimized] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {!isVideoCall && (
                <OwnerHeader 
                    onChatClick={() => {
                        setIsAiOpen(true)
                        setIsAiMinimized(false)
                    }} 
                />
            )}
            <div className={cn(
                "max-w-7xl mx-auto px-6 py-8 flex gap-8 w-full flex-1",
                isServicesPage ? "flex-col" : "flex-row",
                isVideoCall && "max-w-none px-0 py-0 flex-col gap-0 h-screen"
            )}>
                {!isServicesPage && !isVideoCall && (
                    <OwnerSidebar
                        username={user?.username || "Owner"}
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

            {/* Global AI Assistant */}
            {!isExcludedRoute && !isVideoCall && (
                <>
                    {/* Floating Trigger Button */}
                    {(!isAiOpen || isAiMinimized) && (
                        <button 
                            onClick={() => {
                                setIsAiOpen(true)
                                setIsAiMinimized(false)
                            }}
                            className="fixed bottom-6 right-6 w-16 h-16 bg-[#002B49] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-900 transition-all active:scale-95 animate-in zoom-in duration-300 z-50 group border-4 border-white"
                        >
                            <div className="relative">
                                <Bot size={28} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#002B49]" />
                            </div>
                        </button>
                    )}

                    {/* AI Chat Popup */}
                    {isAiOpen && !isAiMinimized && (
                        <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 z-50">
                            <AiAssistant 
                                isPopup={true} 
                                onMinimize={() => setIsAiMinimized(true)} 
                                onClose={() => setIsAiOpen(false)} 
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
