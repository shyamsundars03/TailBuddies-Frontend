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
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex gap-6">{children}</div>
      </div>
    </>
  )
}
