"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { DoctorHeader } from "../../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../../components/common/layout/doctor/PageContainer"
import { Clock, Phone, Mail, ChevronLeft, Edit2, Plus, X } from "lucide-react"

export default function AppointmentDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [availability, setAvailability] = useState("I am Available Now")

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="Appointments">
                <DoctorSidebar
                    userName="Dr. George Anderson"
                    email="sddv"
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-inter">Appointment / {id || "Apt0001"}</h2>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>

                        {/* Top Summary Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                            <div className="flex items-start gap-8">
                                <div className="flex items-center gap-4 min-w-[280px]">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                        <Image src="/placeholder.svg?height=64&width=64" alt="Patient" width={64} height={64} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-blue-600 block">#U0001</span>
                                        <h3 className="text-xl font-bold">Kelly Joseph</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail size={14} /> <span>Kelly@example.com</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone size={14} /> <span>+1 504 368 6874</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-3 gap-8">
                                    <div>
                                        <span className="text-sm font-bold text-gray-400 block mb-1">Person with patient</span>
                                        <p className="text-base font-bold text-gray-800">Andrew (45)</p>
                                        <div className="mt-4">
                                            <span className="text-sm font-bold text-gray-400 block mb-1">Type of Appointment</span>
                                            <div className="flex items-center gap-2 font-bold">
                                                <span className="text-green-600">🏠</span>
                                                <span>Direct Visit</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pt-2">
                                        <button className="w-full py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg shadow-sm">Call</button>
                                        <button className="w-full py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg shadow-sm">Cancel</button>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-600 text-[10px] font-bold rounded-lg mb-2">Upcoming</span>
                                        <span className="text-xs font-bold text-gray-400 mb-1">Consultation Fees : $200</span>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-gray-100 rounded-full text-gray-600"><span className="text-xs">🖨️</span></button>
                                            <button className="p-2 bg-gray-100 rounded-full text-gray-600"><span className="text-xs">✉️</span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <div className="grid grid-cols-5 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Appointment Date & Time</span>
                                    <p className="text-sm font-bold text-gray-800">22 Jul 2023 - 11:30 am</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Clinic Location</span>
                                    <p className="text-sm font-bold text-gray-800">Adrian's Dentistry</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Location</span>
                                    <p className="text-sm font-bold text-gray-800">Newyork, United States</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Visit Type</span>
                                    <p className="text-sm font-bold text-gray-800">General</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-6 py-2 bg-purple-600 text-white text-[10px] font-bold rounded-lg shadow-sm uppercase">Inprogress</span>
                                </div>
                            </div>
                        </div>

                        {/* Session Timer & Cancellation */}
                        <div className="flex items-center justify-between px-6 mb-10">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-600">Session Ends in :</span>
                                <span className="text-sm font-black text-gray-900">01:04:05</span>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-400">Cancel By :</span>
                                    <span className="text-sm font-bold text-gray-700">Doctor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-400">Cancel Reason :</span>
                                    <span className="text-sm font-bold text-gray-700">UnFit State</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Form Grid */}
                        <div className="space-y-12">
                            <h3 className="text-xl font-bold font-inter">Create Appointment Details</h3>

                            {/* Pet Information */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-base font-bold uppercase tracking-wider text-gray-900">Pet Information</h4>
                                    <button className="px-4 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition">Edit</button>
                                </div>
                                <div className="grid grid-cols-4 gap-8">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Name</span>
                                        <p className="text-sm font-bold text-gray-800">Bruno</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Species</span>
                                        <p className="text-sm font-bold text-gray-800">Dog</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Age</span>
                                        <p className="text-sm font-bold text-gray-800">2 years</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Gender</span>
                                        <p className="text-sm font-bold text-gray-800">Male</p>
                                    </div>
                                </div>
                            </section>

                            {/* Vitals */}
                            <section>
                                <h4 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6">Vitals</h4>
                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        { label: "Temperature", unit: "F" },
                                        { label: "Pulse", unit: "mmHg" },
                                        { label: "Respiratory Rate", unit: "bpm" },
                                        { label: "Weight", unit: "Kg" }
                                    ].map((field) => (
                                        <div key={field.label}>
                                            <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">{field.label}</label>
                                            <div className="relative">
                                                <input type="text" placeholder="Eg : 98.6" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{field.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Problem & Symptoms */}
                            <section>
                                <h4 className="text-base font-bold underline decoration-2 underline-offset-8 decoration-transparent text-gray-900 mb-6">Problem & symptoms</h4>
                                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-6">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block mb-1">Problem Description</span>
                                        <p className="text-sm font-medium text-gray-700">My dog is scratching a lot and has red patches on skin.</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block mb-1">Symptoms Selected</span>
                                        <div className="flex gap-2">
                                            {["Itching", "Redness", "Hairloss"].map(s => (
                                                <span key={s} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Notes */}
                            <div className="grid grid-cols-1 gap-12">
                                <section>
                                    <h4 className="text-base font-bold text-gray-900 mb-4">Clinical Notes</h4>
                                    <textarea rows={4} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type here..."></textarea>
                                </section>
                                <section>
                                    <h4 className="text-base font-bold text-gray-900 mb-4">Doctor Notes</h4>
                                    <textarea rows={4} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type here..."></textarea>
                                </section>
                            </div>

                            {/* Diagnosis */}
                            <section>
                                <h4 className="text-base font-bold text-gray-900 mb-6">Diagnosis</h4>
                                <div className="space-y-4">
                                    {["Fever", "Headache", "Stomach Pain"].map((item) => (
                                        <div key={item} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                                            <span className="text-sm font-bold text-gray-700 min-w-[120px]">{item}</span>
                                            <div className="flex-1 h-px bg-gray-100 mx-4" />
                                            <span className="text-xs font-medium text-gray-400 italic">Diagnosis</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Medications */}
                            <section>
                                <h4 className="text-base font-bold text-gray-900 mb-6">Medications</h4>
                                <div className="grid grid-cols-5 gap-4 mb-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Name</label>
                                        <input type="text" className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Dosage</label>
                                        <input type="text" className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Frequency</label>
                                        <input type="text" placeholder="1-0-0" className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm text-center" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Duration</label>
                                        <select className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm appearance-none cursor-pointer">
                                            <option>Select</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Instruction</label>
                                        <div className="flex items-center gap-2">
                                            <input type="text" className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm" />
                                            <button className="text-red-500 font-bold ml-1">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-auto">
                                        Add New
                                    </button>
                                </div>
                            </section>

                            {/* Recommended Test */}
                            <section>
                                <h4 className="text-base font-bold text-gray-900 mb-4">Recommended Test</h4>
                                <textarea rows={4} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type here..."></textarea>
                            </section>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4 pt-8">
                                <button className="px-10 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition tracking-wide">Reset</button>
                                <button className="px-10 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition tracking-wide">Cancel</button>
                                <button className="px-10 py-3 bg-[#002B49] text-white font-bold rounded-2xl hover:bg-[#003B69] transition shadow-lg tracking-wide">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DoctorPageContainer>
            <DoctorFooter />
        </div>
    )
}
