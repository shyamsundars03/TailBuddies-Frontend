"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../../lib/utils/utils"

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  touched?: boolean
  required?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, touched, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const hasError = error && touched

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "w-full px-4 py-2.5 bg-white border rounded text-sm text-gray-700 placeholder-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400",
              "transition-colors duration-200 pr-10",
              hasError ? "border-red-500" : "border-gray-300",
              className,
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {hasError && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
