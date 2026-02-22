// components/auth/AuthLeftPanel.tsx
"use client"
// import logo from "../../app/favicon.ico"
import { cn } from "../../lib/utils/utils"

export interface AuthLeftPanelProps {
    title?: string
    subtitle?: string
    logoSrc?: string
    role?: "owner" | "doctor"
}

export function AuthLeftPanel({
    title,
    subtitle,
    logoSrc = "favicon.ico",
    role = "owner",
}: AuthLeftPanelProps) {
    return (
        <div className="mb-4">
            <div className="mb-4">
                <img src={logoSrc || "/placeholder.svg"} alt="TailBuddies Logo" />
            </div>
            {title && (
                <h3 className={cn("text-xl font-bold mt-4", role === "doctor" ? "text-white" : "text-gray-900")}>{title}</h3>
            )}
            {subtitle && <p className={cn("text-sm", role === "doctor" ? "text-white" : "text-gray-900")}>{subtitle}</p>}
        </div>
    )
}
