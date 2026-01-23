"use client"

import { Badge } from "../../components/common/ui/Badge"

export interface ProfileData {
  userName: string
  gender: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  isActive?: boolean
}

export interface ProfileViewProps {
  data: ProfileData
}

export function ProfileView({ data }: ProfileViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Profile Header with Status */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Account Status:</span>
          <Badge variant={data.isActive !== false ? "default" : "error"}>
            {data.isActive !== false ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{data.userName}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{data.gender}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{data.email}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{data.phone || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Address Section */}
      {(data.address || data.city || data.state || data.country || data.pincode) && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-6">
            {data.address && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{data.address}</p>
                </div>
              </div>
            )}
            {data.city && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{data.city}</p>
                </div>
              </div>
            )}
            {data.state && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{data.state}</p>
                </div>
              </div>
            )}
            {data.country && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{data.country}</p>
                </div>
              </div>
            )}
            {data.pincode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{data.pincode}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
