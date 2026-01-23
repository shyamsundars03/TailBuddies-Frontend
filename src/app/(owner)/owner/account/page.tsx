"use client"

import { AccountForm } from "../../../../components/owner/AccountForm"

export default function OwnerAccountPage() {
  const userData = {
    userName: "Harshika",
    email: "example@gmail.com",
    phone: "",
    gender: "Female",
  }

  const handleSave = (data: any) => {
    console.log("Saving account data:", data)
    // API call to save account data
  }

  const handleSaveAddress = (data: any) => {
    console.log("Saving address data:", data)
    // API call to save address data
  }

  return (
    <AccountForm 
      initialData={userData} 
      onSave={handleSave} 
      onSaveAddress={handleSaveAddress} 
    />
  )
}