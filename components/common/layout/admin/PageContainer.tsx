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
        <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden flex flex-col">
            <AdminHeader title={title} />
            <div className="flex-1 w-full max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8 gap-2 md:gap-8 flex min-w-0">
                <AdminSidebar activeItem={activeItem} className="shrink-0" />
                <main className="flex-1 min-w-0 overflow-hidden">
                    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 min-h-[600px] overflow-x-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
