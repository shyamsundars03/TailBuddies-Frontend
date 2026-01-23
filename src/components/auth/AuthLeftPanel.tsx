"use client"

export interface AuthLeftPanelProps {
  title?: string
  subtitle?: string
  logoSrc?: string
  role?: "owner" | "doctor"
}

export function AuthLeftPanel({
  title,
  subtitle,
  logoSrc = "/tailbuddies-logo.png",
  role = "owner",
}: AuthLeftPanelProps) {
  return (
    <div className="mb-4">
      <div className="mb-4">
        <img src={logoSrc || "/placeholder.svg"} alt="TailBuddies Logo" width="180" height="100" />
      </div>
      {title && (
        <h3 className={cn("text-xl font-bold mt-4", role === "doctor" ? "text-white" : "text-gray-900")}>{title}</h3>
      )}
      {subtitle && <p className={cn("text-sm", role === "doctor" ? "text-white" : "text-gray-900")}>{subtitle}</p>}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
