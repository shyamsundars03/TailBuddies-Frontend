"use client"

import type React from "react"
import { AdminSidebar } from "./Sidebar"
import { AdminHeader } from "./Header"

interface AdminPageContainerProps {
    children: React.ReactNode
    title: string
    activeItem?: string
}

export function AdminPageContainer({ children, title, activeItem }: AdminPageContainerProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader title={title} />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
                <AdminSidebar activeItem={activeItem} />
                <div className="flex-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[600px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
