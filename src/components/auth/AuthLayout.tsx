"use client"

import type React from "react"

// import { cn } from "@/lib/utils"
import { cn } from "../../lib/utils/utils"

export interface AuthLayoutProps {
  children: React.ReactNode
  leftPanel: React.ReactNode
  leftPanelColor?: "yellow" | "blue"
  maxWidth?: "md" | "lg" | "xl"
}

export function AuthLayout({ children, leftPanel, leftPanelColor = "yellow", maxWidth = "lg" }: AuthLayoutProps) {
  const maxWidthClasses = {
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
  }

  const colorClasses = {
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl overflow-hidden w-full flex flex-col md:flex-row",
          maxWidthClasses[maxWidth],
        )}
      >
        {/* Left Panel */}
        <div className={cn("p-16 flex flex-col items-center justify-center md:w-1/2", colorClasses[leftPanelColor])}>
          {leftPanel}
        </div>

        {/* Right Panel - Form */}
        <div className="bg-gray-50 p-10 flex flex-col justify-center md:w-1/2">{children}</div>
      </div>
    </div>
  )
}
