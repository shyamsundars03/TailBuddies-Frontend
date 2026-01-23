"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "../../../lib/utils/utils"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  touched?: boolean
  required?: boolean
  options: SelectOption[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, touched, required, options, ...props }, ref) => {
    const hasError = error && touched

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          className={cn(
            "w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent",
            "transition-colors duration-200",
            hasError ? "border-red-500" : "border-gray-300",
            className,
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasError && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"

export { Select }
