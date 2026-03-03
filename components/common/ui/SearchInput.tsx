"use client"

import { Search } from "lucide-react"
import { cn } from "../../../lib/utils/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void
    containerClassName?: string
}

export function SearchInput({ onSearch, className, containerClassName, ...props }: SearchInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch?.(e.target.value)
        props.onChange?.(e)
    }

    return (
        <div className={cn("relative", containerClassName)}>
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                {...props}
                onChange={handleChange}
                className={cn(
                    "pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm  text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all",
                    className
                )}
            />
        </div>
    )
}
