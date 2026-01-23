"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "../../../lib/utils/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "owner" | "doctor" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  loadingText?: string
  fullWidth?: boolean
  rounded?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      fullWidth = false,
      rounded = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "font-semibold transition-colors duration-200 flex items-center justify-center gap-2"

    const variants = {
      primary: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      owner: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
      doctor: "bg-blue-500 hover:bg-blue-600 text-white",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
      ghost: "hover:bg-gray-100 text-gray-700",
    }

    const sizes = {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          rounded ? "rounded-full" : "rounded",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed",
          className,
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
