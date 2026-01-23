"use client"

import { useState } from "react"
import { Video, MessageSquare } from "lucide-react"
import { DoctorHeader } from "../../components/common/layout/doctor/Header"
// import { DoctorHeader } from "../../components"
import { DoctorSidebar } from "../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../components/common/layout/doctor/PageContainer"

interface Appointment {
  id: number
  name: string
  time: string
  status: "Pending" | "Confirmed"
  avatar: string
}

export function DoctorDashboardContent() {
  const [availability, setAvailability] = useState("I am Available Now")

  const appointments: Appointment[] = [
    { id: 1, name: "Adrian Mordecai", time: "11 Nov 2025 10:41 AM", status: "Pending", avatar: "👨" },
    { id: 2, name: "Kelly Morrevka", time: "11 Nov 2025 11:00 AM", status: "Confirmed", avatar: "👩" },
    // { id: 3, name: "Samual Anderson", time: "11 Nov 2025 05:30 PM", status: "Pending", avatar: "👨" },
    // { id: 4, name: "Lovretine Griffin", time: "11 Nov 2025 08:52 PM", status: "Confirmed", avatar: "👩" },
    // { id: 5, name: "Robert Hutchinson", time: "04 Oct 2025 05:16 PM", status: "Pending", avatar: "👨" },
  ]

  return (
    <div className="min-h-screen ">

      <DoctorPageContainer title="Dashboard">

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="grid gap-6">
            {/* Appointments List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appointment</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        {apt.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.name}</p>
                        <p className="text-xs text-gray-600">{apt.time}</p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                            apt.status === "Confirmed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition">
                        <Video size={16} className="text-white" />
                      </button>
                      <button className="w-9 h-9 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition">
                        <MessageSquare size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointment Card */}
            <div className="bg-linear-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Upcoming Appointment</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                  👨
                </div>
                <div>
                  <p className="font-bold text-lg">Adrian Mordecai</p>
                  <p className="text-blue-100 text-sm">Today, 2:45 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-lg transition text-sm">
                  Chat Now
                </button>
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-lg transition text-sm">
                  Start Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </DoctorPageContainer>

      {/* <DoctorFooter /> */}
    </div>
  )
}
