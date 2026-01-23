"use client"

import { cn } from "../../../lib/utils/utils"

export interface RadioOption {
  value: string
  label: string
}

export interface RadioGroupProps {
  name: string
  label?: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  className,
  orientation = "horizontal",
}: RadioGroupProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-xs text-gray-500 mb-2">{label}</label>}
      <div className={cn("flex", orientation === "horizontal" ? "gap-8" : "flex-col gap-3")}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  value === option.value ? "border-blue-500" : "border-gray-400",
                )}
              >
                {value === option.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
            </div>
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
