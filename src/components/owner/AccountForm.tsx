"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "../../components/common/forms/Input"
import { Select } from "../../components/common/forms/Select"
import { Button } from "../../components/common/ui/Button"

export interface AccountData {
  userName: string
  gender: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
}

export interface AccountFormProps {
  initialData?: Partial<AccountData>
  onSave?: (data: AccountData) => void
  onSaveAddress?: (data: Partial<AccountData>) => void
}

const genderOptions = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Other", label: "Other" },
]

export function AccountForm({ initialData, onSave, onSaveAddress }: AccountFormProps) {
  const [userData, setUserData] = useState<AccountData>({
    userName: initialData?.userName || "",
    gender: initialData?.gender || "Female",
    email: initialData?.email || "",
    phone: initialData?.phone || "9500949667",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "",
    pincode: initialData?.pincode || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveDetails = () => {
    onSave?.(userData)
  }

  const handleSaveAddress = () => {
    onSaveAddress?.({
      address: userData.address,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      pincode: userData.pincode,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account</h2>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input
          label="User Name"
          type="text"
          name="userName"
          value={userData.userName}
          onChange={handleChange}
          className="bg-gray-50"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="bg-gray-50"
          disabled={true} 
        />

        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          className="bg-gray-50"
        />

        <Select label="Gender" name="gender" value={userData.gender} onChange={handleChange} options={genderOptions} />
      </div>

      <div className="flex gap-4 mb-8">
        <Button onClick={handleSaveDetails} variant="owner">
          Save Details
        </Button>
        <Link href="/owner/account/change-password">
          <Button variant="owner">Change Password</Button>
        </Link>
        <Link href="/owner/account/change-email">
          <Button variant="owner">Change Email</Button>
        </Link>
      </div>

      {/* Address Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Address</h2>

      <div className="mb-6">
        <Input label="Address" type="text" name="address" value={userData.address} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Input label="City" type="text" name="city" value={userData.city} onChange={handleChange} required />
        <Input label="State" type="text" name="state" value={userData.state} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Input label="Country" type="text" name="country" value={userData.country} onChange={handleChange} required />
        <Input label="Pincode" type="text" name="pincode" value={userData.pincode} onChange={handleChange} required />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveAddress} variant="owner" className="rounded-lg">
          Save Address
        </Button>
      </div>
    </div>
  )
}
