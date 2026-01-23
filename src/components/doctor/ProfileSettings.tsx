"use client"

import { useState } from "react"
import { DoctorHeader } from "../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../components/common/layout/doctor/PageContainer"

const tabs = ["Basic Details", "Experience", "Education", "Certificates", "Business Hours"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
]

export function DoctorProfileSettings() {
  const [activeTab, setActiveTab] = useState("Basic Details")
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">

      <DoctorPageContainer title="PROFILE">
        {/* Right Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Profile Settings Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition border-b-2 ${
                    activeTab === tab
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Basic Details" && (
              <div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                    <input
                      type="text"
                      placeholder="demo-bd"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter your Number"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition">
                    Save Data
                  </button>
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition">
                    Change Password
                  </button>
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition">
                    Change Email
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Dermatologist</option>
                      <option>Cardiologist</option>
                      <option>Neurologist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Veterinary Dermatologist</option>
                      <option>Senior Consultant</option>
                      <option>Specialist</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition">
                    Save Data
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Experience" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Add</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name of the Organization</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="date"
                        defaultValue="2020-08-12"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                      <input
                        type="date"
                        defaultValue="2020-08-12"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No of Years *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Reset</button>
                  </div>
                </div>

                {/* Experience Entries */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Cambridge (MBBS)</span>
                    <div className="flex gap-3">
                      <button className="text-gray-600 hover:text-gray-700 text-sm">Cancel</button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Cambridge (MBBS)</span>
                    <div className="flex gap-3">
                      <button className="text-gray-600 hover:text-gray-700 text-sm">Cancel</button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Education" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Add</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="invisible"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name of the Institution</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="date"
                        defaultValue="2020-08-12"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                      <input
                        type="date"
                        defaultValue="2020-08-12"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Percentage *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Business Hours" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Business Hours</h3>

                {/* Day Selection */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedDay === day ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-6 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`px-3 py-2 rounded text-xs font-medium transition ${
                        selectedSlots.includes(slot)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition">
                    Save Business Hours
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DoctorPageContainer>

      {/* <DoctorFooter /> */}
    </div>
  )
}
