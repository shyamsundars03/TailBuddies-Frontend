"use client"

import type React from "react"

import { forwardRef } from "react"
// import { cn } from "lib/utils"
import { cn } from "../../../lib/utils/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  touched?: boolean
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, touched, required, type, ...props }, ref) => {
    const hasError = error && touched

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 bg-white border rounded text-sm text-gray-700 placeholder-gray-400",
            "focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400",
            "transition-colors duration-200",
            hasError ? "border-red-500" : "border-gray-300",
            className,
          )}
          ref={ref}
          {...props}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
