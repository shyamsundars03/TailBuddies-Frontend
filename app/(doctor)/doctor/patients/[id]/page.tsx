"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { DoctorHeader } from "../../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../../components/common/layout/doctor/PageContainer"
import { ChevronLeft, Calendar, Clock, MapPin, Phone, Mail, FileText, Activity } from "lucide-react"

export default function PatientDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [availability, setAvailability] = useState("I am Available Now")

    const patient = {
        id: id || "Apt0001",
        name: "Adrian",
        age: 42,
        gender: "Male",
        bloodGroup: "AB+",
        email: "adrian@example.com",
        phone: "+1 504 368 6874",
        location: "Alabama, USA",
        image: "/placeholder.svg?height=128&width=128",
        history: [
            { date: "11 Nov 2025", time: "10:45 AM", type: "General Visit", doctor: "Dr. George Anderson", status: "Completed" },
            { date: "27 Feb 2025", time: "02:15 PM", type: "Dental Consultation", doctor: "Dr. George Anderson", status: "Completed" }
        ],
        vitals: { temp: "98.6 F", pulse: "72 bpm", weight: "75 kg" }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="My Patients">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="dsfsd"
                    qualification="BDS, MDS - Oral & Maxillofacial Surgery"
                    specialty="Dental"
                    totalPatients={1500}
                    patientsToday={15}
                    appointmentsToday={10}
                    availability={availability}
                    onAvailabilityChange={setAvailability}
                    activeSection="patients"
                />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold font-inter">Patient Detail</h2>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>

                        {/* Patient Profile Header Card */}
                        <div className="flex flex-col md:flex-row gap-10 mb-12">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0">
                                <Image src={patient.image} alt={patient.name} width={128} height={128} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-3xl font-black">{patient.name}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">#{patient.id}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Age</span>
                                        <p className="text-sm font-bold">{patient.age} Years</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Gender</span>
                                        <p className="text-sm font-bold">{patient.gender}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Blood Group</span>
                                        <p className="text-sm font-bold text-red-600">{patient.bloodGroup}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Location</span>
                                        <p className="text-sm font-bold flex items-center gap-1"><MapPin size={12} className="text-blue-600" /> {patient.location}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <Mail size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <Phone size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium">{patient.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column - History */}
                            <div className="lg:col-span-2 space-y-10">
                                <section>
                                    <h4 className="text-xl font-bold mb-6 font-inter underline decoration-[#FED141] decoration-4 underline-offset-8">Visit History</h4>
                                    <div className="space-y-4">
                                        {patient.history.map((visit, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md transition">
                                                <div className="p-3 bg-blue-50 rounded-xl">
                                                    <Calendar size={20} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-base font-bold mb-1">{visit.type}</h5>
                                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {visit.date} {visit.time}</span>
                                                        <span className="flex items-center gap-1"><Activity size={12} /> {visit.doctor}</span>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-lg uppercase">{visit.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column - Vitals & Records */}
                            <div className="space-y-10">
                                <section>
                                    <h4 className="text-xl font-bold mb-6 font-inter">Recent Vitals</h4>
                                    <div className="bg-[#002B49] rounded-3xl p-6 text-white space-y-6 shadow-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-blue-200 uppercase">Temperature</span>
                                            <span className="text-xl font-black">{patient.vitals.temp}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-blue-200 uppercase">Pulse Rate</span>
                                            <span className="text-xl font-black">{patient.vitals.pulse}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-blue-200 uppercase">Weight</span>
                                            <span className="text-xl font-black">{patient.vitals.weight}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-xl font-bold mb-6 font-inter">Medical Documents</h4>
                                    <div className="space-y-3">
                                        {["Lab_Report_Feb.pdf", "Prescription_Apt03.pdf"].map((doc, i) => (
                                            <button key={i} className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 transition border-dashed group">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={18} className="text-gray-400 group-hover:text-blue-600" />
                                                    <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">{doc}</span>
                                                </div>
                                                <span className="text-xs font-black text-blue-600">VIEW</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}
