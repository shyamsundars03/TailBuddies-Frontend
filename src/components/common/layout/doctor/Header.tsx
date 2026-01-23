"use client"
import { Search, Bell, MessageSquare, User } from "lucide-react"

export function DoctorHeader() {
  return (
    <header className=  "sticky top-0 z-50 bg-blue-600 text-white px-6 py-3 flex items-center shadow-md">
      <div className="flex items-center gap-3 ml-10">
        <div className="flex items-center gap-2 ml-28">
          <div className="mb-0">
            <img src="/tailbuddies-logo.png" alt="TailBuddies Logo" width="50" height="70" />
          </div>
          <span className="font-bold text-lg">TailBuddies.</span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto mr-20">
        <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
          <Search size={18} />
        </button>
        <button className="w-9 h-9 bg-black bg-opacity-100 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
          <Bell size={18} />
        </button>
        <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
          <MessageSquare size={18} />
        </button>
        <button className="w-9 h-9 bg-black  bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition">
          <User size={18} />
        </button>
      </div>
    </header>
  )
}
