"use client"

import { User } from "lucide-react"

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
        <User size={20} className="text-gray-700" />
      </button>
    </header>
  )
}