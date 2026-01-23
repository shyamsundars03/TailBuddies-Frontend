"use client"

import { useState } from "react"
import { Calendar, Users, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DoctorSidebarProps {
  userName: string
  email: string
  qualification: string
  specialty?: string
  totalPatients: number
  patientsToday: number
  appointmentsToday: number
  availability: string
  onAvailabilityChange?: (value: string) => void
  onImageClick?: () => void  // Add this
  activeSection: string       // Add this
  onSectionChange?: (sectionId: string) => void  // Add this
  showStats?: boolean
  showChangeButton?: boolean
}

// Update menu items with routes
const menuItems = [
  { icon: "📊", label: "Dashboard", id: "dashboard", href: "/doctor/dashboard", badge: false },
  { icon: "⚙️", label: "Profile Settings", id: "profile", href: "/doctor/profile", badge: false },
  { icon: "📋", label: "Requests", id: "requests", href: "#", badge: true },
  { icon: "📅", label: "Appointments", id: "appointments", href: "#", badge: false },
  { icon: "⏰", label: "Available Timings", id: "timings", href: "#", badge: false },
  { icon: "👥", label: "My Patients", id: "patients", href: "#", badge: false },
  { icon: "💳", label: "Subscription", id: "subscription", href: "#", badge: false },
  { icon: "⭐", label: "Reviews", id: "reviews", href: "#", badge: false },
  { icon: "💰", label: "Invoices", id: "invoices", href: "#", badge: false },
  { icon: "🔔", label: "Notifications", id: "notifications", href: "#", badge: true },
  { icon: "💬", label: "Message", id: "message", href: "#", badge: false },
  { icon: "🤖", label: "AGMail", id: "agmail", href: "#", badge: false },
  { icon: "🚪", label: "Logout", id: "logout", href: "#", badge: false },
]

export function DoctorSidebar({
  userName,
  email,
  qualification,
  specialty,
  totalPatients,
  patientsToday,
  appointmentsToday,
  availability,
  onAvailabilityChange,
  onImageClick,
  activeSection,
  onSectionChange,
  showStats = true,
  showChangeButton = false,
}: DoctorSidebarProps) {
  const pathname = usePathname()
  const isProfilePage = pathname === "/doctor/profile"

  return (
    <div className="w-80 shrink-0">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Section */}
        <div className="bg-linear-to-br from-blue-600 to-blue-500 p-6 text-center">
          <div 
            className={`w-24 h-24 mx-auto bg-white rounded-full overflow-hidden mb-3 border-4 border-white shadow-lg ${!isProfilePage && onImageClick ? 'cursor-pointer' : ''}`}
            onClick={!isProfilePage && onImageClick ? onImageClick : undefined}
          >
            <img src="/placeholder.svg?height=96&width=96" alt="Doctor" className="w-full h-full object-cover" />
          </div>
          
          {/* Change button ONLY on profile page */}
          {isProfilePage && (
            <div className="top-6 right-6 w-16 h-6 bg-red-500 rounded-full flex items-center justify-center ml-auto mb-2">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          )}
          
          <h3 className="text-white font-bold text-lg mb-1">{userName}</h3>
          <p className="text-blue-100 text-sm">{qualification}</p>
        </div>

        {/* Rest of your sidebar code remains exactly the same... */}
        {/* Specialty Label */}
        {specialty && (
          <div className="px-6 py-3 text-center border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{specialty}</span>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <>
            <div className="grid grid-cols-2 border-b border-gray-200">
              <div className="p-4 text-center border-r border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users size={18} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Total Patient</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar size={18} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Patients Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{patientsToday}</p>
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm text-gray-600 mb-2">Availability :</label>
              <select
                value={availability}
                onChange={(e) => onAvailabilityChange?.(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>I am Available Now</option>
                <option>Not Available</option>
                <option>Available Later</option>
              </select>
            </div>

            {/* Appointments Today */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-sm text-gray-600">Appointments Today</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{appointmentsToday}</p>
            </div>
          </>
        )}

        {/* Menu Items - Updated with navigation */}
        <div className="py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            
            return item.href && item.href !== "#" ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onSectionChange?.(item.id)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition group ${
                  isActive ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`text-sm ${isActive ? "text-blue-600 font-medium" : "text-gray-700 group-hover:text-blue-600"}`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition group ${
                  activeSection === item.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`text-sm ${activeSection === item.id ? "text-blue-600 font-medium" : "text-gray-700 group-hover:text-blue-600"}`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}