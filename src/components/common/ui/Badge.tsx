"use client"

import type React from "react"

import { cn } from "../../../lib/utils/utils"

export interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "owner" | "doctor" | "success" | "warning" | "error"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    owner: "bg-yellow-100 text-yellow-800",
    doctor: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    error: "bg-red-100 text-red-800",
  }

  return (
    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  )
}
