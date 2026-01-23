"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminSidebarProps {
  activeItem?: string
  onItemClick?: (id: string) => void
}

// Update menu items with actual routes
const menuItems = [
  { icon: "🏠", label: "Dashboard", id: "dashboard", href: "/admin/dashboard" },
  { icon: "👨‍⚕️", label: "Doctors", id: "doctors", href: "#" },
  { icon: "👥", label: "Users", id: "users", href: "/admin/users" },
  { icon: "🐕", label: "Pets", id: "pets", href: "#" },
  { icon: "📋", label: "Specialities", id: "specialities", href: "/admin/specialities" },
  { icon: "📅", label: "Appointments", id: "appointments", href: "#" },
  { icon: "📝", label: "Subscriptions", id: "subscriptions", href: "#" },
  { icon: "⭐", label: "Reviews", id: "reviews", href: "#" },
  { icon: "💰", label: "Payments", id: "payments", href: "#" },
  { icon: "⚡", label: "Transactions", id: "transactions", href: "#" },
  { icon: "💬", label: "Chat / Call", id: "chat", href: "#" },
  { icon: "📊", label: "Reports", id: "reports", href: "#" },
  { icon: "🚪", label: "Logout", id: "logout", href: "#" },
]

export function AdminSidebar({ activeItem = "dashboard", onItemClick }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-700 text-white shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🐕</span>
          </div>
          <span className="font-bold text-lg">TailBuddies</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || activeItem === item.id
          
          return item.href && item.href !== "#" ? (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onItemClick?.(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                isActive ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                isActive ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}