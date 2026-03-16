"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { Clock, Video, User, Info, ChevronDown } from "lucide-react"
import { Pagination } from "../../../../components/common/ui/Pagination"

const requests = [
    {
        id: "Apt0001",
        patientName: "Adrian",
        date: "11 Nov 2025",
        time: "10.45 AM",
        reason: "Consultation for Dental",
        type: "Video Call",
        isNew: true,
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0002",
        patientName: "Kelly",
        date: "10 Nov 2025",
        time: "02.00 PM",
        reason: "Consultation for Dental",
        type: "Direct Visit",
        isNew: false,
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0003",
        patientName: "Samuel",
        date: "08 Nov 2025",
        time: "08.30 AM",
        reason: "Rebooking",
        type: "video Call",
        isNew: false,
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0004",
        patientName: "Anderea",
        date: "05 Nov 2025",
        time: "11.00 AM",
        reason: "Subscription",
        type: "video Call",
        isNew: false,
        image: "/placeholder.svg?height=48&width=48"
    }
]

export default function RequestsPage() {
    const [availability, setAvailability] = useState("I am Available Now")
    const [currentPage, setCurrentPage] = useState(1)

    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorHeader />
            <DoctorPageContainer title="Requests">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="sdsd"
                    qualification="BDS, MDS - Oral & Maxillofacial Surgery"
                    specialty="Dental"
                    totalPatients={1500}
                    patientsToday={15}
                    appointmentsToday={10}
                    availability={availability}
                    onAvailabilityChange={setAvailability}
                    activeSection="requests"
                />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 font-inter">Requests</h2>
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition">
                                    Last 7 Days <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div key={request.id} className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md hover:border-blue-100">
                                    <div className="flex items-center gap-6">
                                        {/* Patient Avatar & Name */}
                                        <div className="flex items-center gap-4 min-w-[180px]">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                <Image src={request.image} alt={request.patientName} width={56} height={56} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-blue-600">#{request.id}</span>
                                                    {request.isNew && (
                                                        <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded-full">New</span>
                                                    )}
                                                </div>
                                                <Link href={`/doctor/requests/${request.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition truncate block">
                                                    {request.patientName}
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Appointment Info */}
                                        <div className="flex-1 grid grid-cols-2 gap-8">
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <Clock size={16} className="text-blue-600" />
                                                    <span className="text-sm font-medium">{request.date} {request.time}</span>
                                                </div>
                                                <p className="text-base font-bold text-gray-900">{request.reason}</p>
                                            </div>

                                            <div>
                                                <span className="text-sm font-bold text-gray-900 block mb-2 font-inter text-[#002B49]">Type of Appointment</span>
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    {request.type.toLowerCase().includes('video') ? (
                                                        <Video size={18} fill="currentColor" />
                                                    ) : (
                                                        <User size={18} fill="currentColor" />
                                                    )}
                                                    <span className="text-sm font-bold text-gray-700 capitalize">{request.type}</span>
                                                    {!request.type.toLowerCase().includes('video') && (
                                                        <Info size={14} className="text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-6 pr-4">
                                            <div className="h-10 w-px bg-gray-100 mx-2" />
                                            <button className="text-sm font-bold text-green-500 hover:text-green-600 transition uppercase tracking-wider">Accept</button>
                                            <button className="text-sm font-bold text-red-500 hover:text-red-600 transition uppercase tracking-wider">Reject</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={5}
                            onPageChange={setCurrentPage}
                            totalEntries={48}
                            entriesPerPage={10}
                            className="mt-8 pt-8 border-t border-gray-100 px-2"
                        />
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}
