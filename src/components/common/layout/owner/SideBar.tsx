"use client"

import {
  User,
  Calendar,
  FileText,
  Phone,
  Wallet,
  MessageSquare,
  Bell,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "../../../../lib/utils/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface SidebarMenuItem {
  icon: LucideIcon
  label: string
  id: string
  badge?: boolean
  href?: string
}

export interface OwnerSidebarProps {
  userName: string
  email: string
  activeSection: string
  onSectionChange: (sectionId: string) => void
  showChangeButton?: boolean
  onImageClick?: () => void  // Add this prop
  className?: string
}

const defaultMenuItems: SidebarMenuItem[] = [
  { icon: User, label: "Account", id: "account", href: "/owner/account" },
  { icon: Calendar, label: "My Pet", id: "pet", href: "#" },
  { icon: FileText, label: "My Bookings", id: "bookings", href: "#" },
  { icon: FileText, label: "Medical Records", id: "medical", href: "#" },
  { icon: Calendar, label: "Calendar", id: "calendar", href: "#" },
  { icon: Phone, label: "Chat / Call", id: "chat", href: "#", badge: true },
  { icon: MessageSquare, label: "AI Assistant", id: "ai", href: "#" },
  { icon: Bell, label: "Notifications", id: "notifications", href: "#" },
  { icon: Wallet, label: "Wallet", id: "wallet", href: "#" },
  { icon: FileText, label: "Subscription", id: "subscription", href: "#" },
  { icon: FileText, label: "Reviews", id: "reviews", href: "#" },
  { icon: LogOut, label: "SignOut", id: "signout", href: "#" },
]

export function OwnerSidebar({
  userName,
  email,
  activeSection,
  onSectionChange,
  showChangeButton = false,
  onImageClick,  // Add this prop
  className,
}: OwnerSidebarProps) {
  const pathname = usePathname()
  const isProfilePage = pathname === "/owner/profile"  // Check if we're on profile page

  return (
    <div className={cn("md:w-80", className)}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-linear-to-br from-blue-900 to-blue-700 p-6 relative">
          <div 
            className={`flex flex-col items-center ${!isProfilePage && onImageClick ? 'cursor-pointer' : ''}`}
            onClick={!isProfilePage && onImageClick ? onImageClick : undefined}
          >
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-3 border-4 border-white">
              <span className="text-3xl">👤</span>
            </div>
            
            {/* Show Change button ONLY on profile page AND if showChangeButton is true */}
            {isProfilePage && (
              <div className="absolute top-6 right-6 w-16 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                <span className="text-white text-xs font-bold">Change</span>
              </div>
            )}
            
            <h3 className="text-white font-semibold text-lg">{userName}</h3>
            <p className="text-blue-200 text-sm">{email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {defaultMenuItems.map((item) => {
            const isActive = pathname === item.href
            
            return item.href && item.href !== "#" ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition",
                  isActive && "bg-yellow-50 border-l-4 border-yellow-400",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition",
                  activeSection === item.id && "bg-yellow-50 border-l-4 border-yellow-400",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}