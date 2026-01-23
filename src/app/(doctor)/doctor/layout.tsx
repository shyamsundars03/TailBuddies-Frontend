"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DoctorHeader } from "../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../components/common/layout/doctor/PageContainer"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const router = useRouter()
  
  const doctorData = {
    userName: "Dr. John Smith",
    email: "dr.john@example.com",
    qualification: "MD, Cardiologist",
    specialty: "Cardiology",
    totalPatients: 1247,
    patientsToday: 8,
    appointmentsToday: 12,
    availability: "I am Available Now"
  }

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    
    if (sectionId === "dashboard") {
      router.push('/doctor/dashboard')
    } else if (sectionId === "profile") {
      router.push('/doctor/profile')
    }
  }

  const handleImageClick = () => {
    router.push('/doctor/profile')
  }

  const handleAvailabilityChange = (value: string) => {
    console.log("Availability changed to:", value)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DoctorHeader />
      <div className="mt-6 flex-1">
        <DoctorPageContainer title="">
          <DoctorSidebar
            userName={doctorData.userName}
            email={doctorData.email}
            qualification={doctorData.qualification}
            specialty={doctorData.specialty}
            totalPatients={doctorData.totalPatients}
            patientsToday={doctorData.patientsToday}
            appointmentsToday={doctorData.appointmentsToday}
            availability={doctorData.availability}
            onAvailabilityChange={handleAvailabilityChange}
            onImageClick={handleImageClick}
            activeSection={activeSection}
            onSectionChange={handleSectionChange} 
            showStats={true}
          />
          <div className="flex-1">
            {children}
          </div>
        </DoctorPageContainer>
      </div>
      <DoctorFooter />
    </div>
  )
}