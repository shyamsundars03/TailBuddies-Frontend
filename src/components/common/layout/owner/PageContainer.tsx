"use client"

import type React from "react"

import { cn } from  "../../../../lib/utils/utils"

export interface PageContainerProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function PageContainer({ children, title, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-linear-to-b from-blue-50 to-blue-100", className)}>
      {title && (
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 pb-16 pt-6">{children}</div>
    </div>
  )
}
