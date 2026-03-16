"use client"

import type React from "react"

interface DoctorPageContainerProps {
    children: React.ReactNode
    title: string
}

export function DoctorPageContainer({ children, title }: DoctorPageContainerProps) {
    return (
        <>
            {/* Page Title */}
            <div className="text-center py-4">
                <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2  pb-12 overflow-x-hidden">
                <div className="flex flex-col lg:flex-row gap-4">{children}</div>
            </div>
        </>
    )
}
