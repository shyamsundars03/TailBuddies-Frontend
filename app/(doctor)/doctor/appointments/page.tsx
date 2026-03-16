"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { Clock, Search, Filter, Calendar as CalendarIcon, Eye, Trash2, LayoutGrid, List } from "lucide-react"

const appointments = [
    {
        id: "Apt0001",
        patientName: "Adrian",
        date: "11 Nov 2025",
        time: "10.45 AM",
        type: "General Visit",
        method: "Video Call",
        email: "adrian@example.com",
        phone: "+1 504 368 6874",
        status: "Upcoming",
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0002",
        patientName: "Kelly",
        date: "05 Nov 2025",
        time: "11.50 AM",
        type: "General Visit",
        method: "Audio Call",
        email: "kelly@example.com",
        phone: "+1 832 891 8403",
        status: "Upcoming",
        isNew: true,
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0003",
        patientName: "Samuel",
        date: "27 Oct 2025",
        time: "09.30 AM",
        type: "General Visit",
        method: "Video Call",
        email: "samuel@example.com",
        phone: "+1 749 104 6291",
        status: "Upcoming",
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0004",
        patientName: "Catherine",
        date: "18 Oct 2025",
        time: "12.20 PM",
        type: "General Visit",
        method: "Direct Visit",
        email: "catherine@example.com",
        phone: "+1 584 920 7183",
        status: "Upcoming",
        image: "/placeholder.svg?height=48&width=48"
    },
    {
        id: "Apt0005",
        patientName: "Robert",
        date: "10 Oct 2025",
        time: "11.30 AM",
        type: "General Visit",
        method: "Chat",
        email: "robert@example.com",
        phone: "+1 059 327 6729",
        status: "Upcoming",
        image: "/placeholder.svg?height=48&width=48"
    }
]

export default function AppointmentsPage() {
    const [availability, setAvailability] = useState("I am Available Now")
    const [activeTab, setActiveTab] = useState("Upcoming")

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="Appointments">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="sdv"
                    qualification="BDS, MDS - Oral & Maxillofacial Surgery"
                    specialty="Dental"
                    totalPatients={1500}
                    patientsToday={15}
                    appointmentsToday={10}
                    availability={availability}
                    onAvailabilityChange={setAvailability}
                    activeSection="appointments"
                />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-inter">Appointments</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                                </div>
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                    <button className="p-2 bg-blue-600 text-white"><LayoutGrid size={18} /></button>
                                    <button className="p-2 bg-white text-gray-400 hover:bg-gray-50"><List size={18} /></button>
                                </div>
                                <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"><Filter size={18} /></button>
                            </div>
                        </div>

                        {/* Tabs & Date Range */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-4 p-1 bg-gray-50 rounded-xl">
                                {["Upcoming", "Cancelled", "Completed"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {tab} <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-gray-200'}`}>{tab === "Upcoming" ? 21 : tab === "Cancelled" ? 18 : 214}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                                    <CalendarIcon size={16} className="text-blue-600" />
                                    <span>08/04/2020 - 08/11/2020</span>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                                    <Filter size={16} className="text-blue-600" />
                                    Filter By <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Appointment Rows */}
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md hover:border-blue-100">
                                    <div className="flex items-center gap-8">
                                        {/* Patient Avatar & Name */}
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                <Image src={apt.image} alt={apt.patientName} width={56} height={56} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-600">
                                                    #{apt.id}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold">{apt.patientName}</span>
                                                    {apt.isNew && <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded-full">New</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Type */}
                                        <div className="min-w-[180px]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock size={16} className="text-blue-600" />
                                                <span className="text-sm font-medium text-gray-900">{apt.date} {apt.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className="font-bold text-gray-700">{apt.type}</span>
                                                <span className="w-px h-3 bg-gray-300 mx-1" />
                                                <span className="font-bold text-gray-700">{apt.method}</span>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 group-hover:text-blue-600 transition">
                                                <span className="text-gray-400">📧</span>
                                                <span className="text-sm font-medium text-gray-600">{apt.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">📞</span>
                                                <span className="text-sm font-medium text-gray-600">{apt.phone}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4">
                                            <Link href={`/doctor/appointments/${apt.id}`} className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition shadow-sm">
                                                <Eye size={18} />
                                            </Link>
                                            <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition shadow-sm">
                                                <span className="text-lg">💬</span>
                                            </button>
                                            <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="ml-4 px-6 py-2.5 bg-white border border-blue-600 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                                                Start Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Showing 1 to 8 of 12 entries</span>
                            <div className="flex items-center gap-1">
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 font-bold hover:bg-gray-50 transition">Previous</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50 transition">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold bg-yellow-500 text-white shadow-md">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50 transition">3</button>
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-bold hover:bg-gray-50 transition">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}

function ChevronDown({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
}
