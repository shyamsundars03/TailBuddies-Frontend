"use client"

import Link from "next/link"
import { Search, Bell, MessageSquare, User } from "lucide-react"

export interface OwnerHeaderProps {
  className?: string
}

export function OwnerHeader({ className }: OwnerHeaderProps) {
  return (
    // <header className={`bg-yellow-400 px-6 py-0 flex items-center justify-between pl-40 pr-40 ${className || ""}`}>
      <header className={`sticky top-0 z-50 bg-yellow-400 px-6 py-0 flex items-center justify-between pl-40 pr-40 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <div className="mb-0">
          <img src="/tailbuddies-logo.png" alt="TailBuddies Logo" width="100" height="70" />
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm ml-auto">
        <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
          Home
        </Link>
        <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          About
        </Link>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Services
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Contacts
        </a>
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
          <Search size={18} className="text-gray-700" />
        </button>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
          <Bell size={18} className="text-gray-700" />
        </button>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
          <MessageSquare size={18} className="text-gray-700" />
        </button>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
          <User size={18} className="text-gray-700" />
        </button>
      </div>
    </header>
  )
}
