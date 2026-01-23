"use client"

import { cn } from "../../../lib/utils/utils"

export interface RoleOption {
  value: string
  label: string
  description: string
  icon: string
  activeColor: string
  ringColor: string
}

export interface RoleSelectorProps {
  options: RoleOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RoleSelector({ options, value, onChange, className }: RoleSelectorProps) {
  return (
    <div className={cn("mb-4", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">I want to join as:</label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn("flex-1 cursor-pointer", value === option.value ? `ring-2 ${option.ringColor}` : "")}
          >
            <input
              type="radio"
              name="role"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div
              className={cn(
                "p-4 rounded-lg text-center transition-colors",
                value === option.value ? option.activeColor : "bg-white border border-gray-300",
              )}
            >
              <span className="text-lg">{option.icon}</span>
              <div className="font-medium text-gray-900 mt-1">{option.label}</div>
              <div className="text-xs text-gray-600">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
