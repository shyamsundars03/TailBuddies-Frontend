"use client"

import type React from "react"

// import { AdminSidebar } from "./Sidebar"
import { AdminSidebar } from "./SideBar"
import { AdminHeader } from "./Header"

interface AdminPageContainerProps {
  children: React.ReactNode
  title: string
  activeItem?: string
}

export function AdminPageContainer({ children, title, activeItem }: AdminPageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* <AdminSidebar activeItem={activeItem} /> */}

      <div className="flex-1 overflow-auto">
        {/* <AdminHeader title={title} /> */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
