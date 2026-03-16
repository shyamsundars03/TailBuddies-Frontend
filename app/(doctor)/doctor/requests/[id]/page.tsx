"use client"

import { useState } from "react"
import Image from "next/image"
// import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DoctorHeader } from "../../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../../components/common/layout/doctor/PageContainer"
import { Clock, Video, User, ChevronLeft } from "lucide-react"

export default function RequestDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [availability, setAvailability] = useState("I am Available Now")

    // Mock data for the specific request
    const request = {
        id: id || "Apt0001",
        patientName: "Adrian",
        date: "11 Nov 2025",
        time: "10.45 AM",
        reason: "Consultation for Dental",
        type: "Video Call",
        isNew: true,
        image: "/placeholder.svg?height=48&width=48",
        petName: "Bruno",
        species: "Dog",
        breed: "Golden Retriever",
        problemDescription: "My dog is scratching a lot and has red patches on skin.",
        symptoms: ["Itching", "Redness", "Hairloss"]
    }

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="Requests">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="sdvs"
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {/* Header with Back Button */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-inter">Requests</h2>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>

                        {/* Request Summary Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4 min-w-[200px]">
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
                                        <span className="text-lg font-bold block">{request.patientName}</span>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Clock size={16} className="text-blue-600" />
                                            <span className="text-sm font-medium">{request.date} {request.time}</span>
                                        </div>
                                        <p className="text-base font-bold">{request.reason}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold block mb-2 font-inter">Type of Appointment</span>
                                        <div className="flex items-center gap-2 text-blue-600">
                                            {request.type.toLowerCase().includes('video') ? (
                                                <Video size={18} fill="currentColor" />
                                            ) : (
                                                <User size={18} fill="currentColor" />
                                            )}
                                            <span className="text-sm font-bold text-gray-700">{request.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 pr-4">
                                    <div className="h-10 w-px bg-gray-100 mx-2" />
                                    <button className="text-sm font-bold text-green-500 hover:text-green-600 transition uppercase tracking-wider">Accept</button>
                                    <button className="text-sm font-bold text-red-500 hover:text-red-600 transition uppercase tracking-wider">Reject</button>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Sections */}
                        <div className="space-y-10">
                            {/* Pet Details */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 font-inter underline decoration-2 underline-offset-8 decoration-transparent">Pet:</h3>
                                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6">
                                    <div className="grid grid-cols-3 gap-8">
                                        <div>
                                            <span className="text-sm font-bold text-gray-500 block mb-2 font-inter">Pet Name</span>
                                            <p className="text-sm font-medium text-gray-700">{request.petName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-500 block mb-2 font-inter">Species</span>
                                            <p className="text-sm font-medium text-gray-700">{request.species}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-500 block mb-2 font-inter">Breed</span>
                                            <p className="text-sm font-medium text-gray-700">{request.breed}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Problem & Symptoms */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 font-inter">Problem & symptoms</h3>
                                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-8">
                                    <div>
                                        <span className="text-sm font-bold text-gray-500 block mb-2 font-inter">Problem Description</span>
                                        <p className="text-sm font-medium text-gray-700">{request.problemDescription}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-500 block mb-2 font-inter">Symptoms Selected</span>
                                        <p className="text-sm font-medium text-gray-700">{request.symptoms.join(", ")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}
