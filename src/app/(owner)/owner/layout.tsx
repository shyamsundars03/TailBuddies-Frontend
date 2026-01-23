"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OwnerHeader } from "../../../components/common/layout/owner/Header"
import { OwnerSidebar } from "../../../components/common/layout/owner/SideBar"
import { PageContainer } from "../../../components/common/layout/owner/PageContainer"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState("account")
  const router = useRouter()  // Add this for navigation
  
  // Get user data - in real app, fetch from Redux/context
  const userData = {
    userName: "Hendrika",
    email: "hendrika@gmail.com",
  }

  // Handle sidebar item clicks
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  // Handle image click to navigate to profile
  const handleImageClick = () => {
    router.push('/owner/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerHeader />
        <PageContainer>
          <div className="flex flex-col md:flex-row gap-6">
            <OwnerSidebar
              userName={userData.userName}
              email={userData.email}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onImageClick={handleImageClick} 
              // REMOVE showChangeButton from here - it will be passed by individual pages
            />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </PageContainer>
    </div>
  )
}