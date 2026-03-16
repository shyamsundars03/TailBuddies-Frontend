"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { Search, Filter, Calendar, MapPin, ChevronDown } from "lucide-react"
import { Pagination } from "../../../../components/common/ui/Pagination"

const patients = [
    {
        id: "Apt0001",
        name: "Adrian",
        age: 42,
        gender: "Male",
        bloodGroup: "AB+",
        lastBooking: "27 Feb 2025",
        appointmentDate: "11 Nov 2025 10.45 AM",
        location: "Alabama, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0002",
        name: "Kelly Stevens",
        age: 37,
        gender: "Female",
        bloodGroup: "O+",
        lastBooking: "20 Mar 2025",
        appointmentDate: "05 Nov 2025 11.50 AM",
        location: "San Diego, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0003",
        name: "Samuel James",
        age: 43,
        gender: "Male",
        bloodGroup: "B+",
        lastBooking: "12 Mar 2025",
        appointmentDate: "27 Oct 2025 09.30 AM",
        location: "Chicago, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0004",
        name: "Catherine Gracey",
        age: 36,
        gender: "Female",
        bloodGroup: "AB-",
        lastBooking: "27 Feb 2025",
        appointmentDate: "18 Oct 2025 12.20 PM",
        location: "Los Angeles, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0005",
        name: "Robert Miller",
        age: 38,
        gender: "Male",
        bloodGroup: "A+",
        lastBooking: "18 Feb 2025",
        appointmentDate: "10 Oct 2025 11.30 AM",
        location: "Dallas, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0006",
        name: "Anderea Kearns",
        age: 40,
        gender: "Female",
        bloodGroup: "B-",
        lastBooking: "11 Feb 2025",
        appointmentDate: "26 Sep 2025 10.20 AM",
        location: "San Francisco, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0007",
        name: "Peter Anderson",
        age: 30,
        gender: "Male",
        bloodGroup: "A-",
        lastBooking: "25 Jan 2025",
        appointmentDate: "14 Sep 2025 08.10 AM",
        location: "Austin, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0008",
        name: "Emily Musick",
        age: 32,
        gender: "Female",
        bloodGroup: "O-",
        lastBooking: "13 Jan 2025",
        appointmentDate: "03 Sep 2025 06.00 PM",
        location: "Nashville, USA",
        image: "/placeholder.svg?height=100&width=100"
    },
    {
        id: "Apt0009",
        name: "Darrell Tan",
        age: 31,
        gender: "Male",
        bloodGroup: "AB+",
        lastBooking: "03 Jan 2025",
        appointmentDate: "25 Aug 2025 10.45 AM",
        location: "San Antonio, USA",
        image: "/placeholder.svg?height=100&width=100"
    }
]

export default function PatientsPage() {
    const [availability, setAvailability] = useState("I am Available Now")
    const [activeTab, setActiveTab] = useState("Active")
    const [currentPage, setCurrentPage] = useState(1)

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="My Patients">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="adsvs"
                    qualification="BDS, MDS - Oral & Maxillofacial Surgery"
                    specialty="Dental"
                    totalPatients={1500}
                    patientsToday={15}
                    appointmentsToday={10}
                    availability={availability}
                    onAvailabilityChange={setAvailability}
                    activeSection="patients"
                />

                <div className="flex-1 min-w-0">
                    {/* Header Controls */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-inter">My Patients</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                                {["Active", "Offline"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {tab} <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-gray-200'}`}>{tab === "Active" ? 200 : 50}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                                    <Calendar size={16} className="text-blue-600" />
                                    <span className="text-xs">09 December 25 - 09 December 25</span>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium group">
                                    <Filter size={16} className="text-blue-600" />
                                    <span className="text-xs group-hover:text-blue-600 transition">Filter By</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.map((patient) => (
                            <div key={patient.id} className="group bg-white rounded-3xl border border-gray-100 p-6 transition-all hover:shadow-xl hover:border-blue-100 flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <Link href={`/doctor/patients/${patient.id}`} className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm transition-transform hover:scale-105 block shrink-0">
                                        <Image src={patient.image} alt={patient.name} width={80} height={80} className="w-full h-full object-cover" />
                                    </Link>
                                    <div className="space-y-1 min-w-0">
                                        <span className="text-xs font-bold text-blue-600">#{patient.id}</span>
                                        <Link href={`/doctor/patients/${patient.id}`} className="text-lg font-bold hover:text-blue-600 transition truncate block leading-tight">
                                            {patient.name}
                                        </Link>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                                            <span>Age : {patient.age}</span>
                                            <span>{patient.gender}</span>
                                            <span>{patient.bloodGroup}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 rounded-2xl p-4 space-y-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Calendar size={16} className="text-blue-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{patient.appointmentDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <MapPin size={16} className="text-blue-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 truncate">{patient.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 mt-auto text-[#002B49]">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-400">Last Booking</span>
                                    <span className="text-xs font-bold ml-auto">{patient.lastBooking}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={20}
                            onPageChange={setCurrentPage}
                            totalEntries={200}
                            entriesPerPage={9}
                            className="py-6 px-8"
                        />
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}
