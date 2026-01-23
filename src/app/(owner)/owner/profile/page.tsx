"use client"

import { useState } from "react"  // Add useState if needed
import { ProfileView } from "../../../../components/owner/ProfileView"

export default function OwnerProfilePage() {
  const [activeSection, setActiveSection] = useState("account")  // Add if needed
  
  const userData = {
    userName: "Hendrika",
    email: "hendrika@gmail.com",
    phone: "9500949667",
    gender: "Female",
    isActive: true,
    address: "12A, MG Road",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600001",
  }

  // This component doesn't render Sidebar anymore - it's in layout
  return <ProfileView data={userData} />
}