"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "../../../components/common/layout/admin/SideBar"
import { AdminHeader } from "../../../components/common/layout/admin/Header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeItem, setActiveItem] = useState("dashboard")
  const router = useRouter()

  // Handle sidebar navigation
  const handleItemClick = (id: string) => {
    setActiveItem(id)
    
    // Map sidebar items to routes
    const routeMap: Record<string, string> = {
      dashboard: "/admin/dashboard",
      users: "/admin/users",
      specialities: "/admin/specialities",
      doctors: "#",
      pets: "#",
      appointments: "#",
      subscriptions: "#",
      reviews: "#",
      payments: "#",
      transactions: "#",
      chat: "#",
      reports: "#",
      logout: "#"
    }
    
    if (routeMap[id] && routeMap[id] !== "#") {
      router.push(routeMap[id])
    }
  }

  // Get title based on active item
  const getTitle = () => {
    const titleMap: Record<string, string> = {
      dashboard: "Dashboard",
      users: "User Management",
      specialities: "Specialities Management",
      doctors: "Doctors Management",
      pets: "Pets Management",
      appointments: "Appointments",
      subscriptions: "Subscriptions",
      reviews: "Reviews",
      payments: "Payments",
      transactions: "Transactions",
      chat: "Chat / Call",
      reports: "Reports"
    }
    return titleMap[activeItem] || "Admin Dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Stays fixed */}
      <AdminSidebar 
        activeItem={activeItem} 
        onItemClick={handleItemClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Sticky Header */}
        <AdminHeader title={getTitle()} />
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}