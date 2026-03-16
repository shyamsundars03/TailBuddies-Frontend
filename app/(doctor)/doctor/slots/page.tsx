"use client"

import { useState } from "react"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../components/common/layout/doctor/Footer"
import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle2, AlertCircle, Filter, ChevronDown, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react"

export default function SlotManagementPage() {
    const [availability, setAvailability] = useState("I am Available Now")
    const [selectedDate, setSelectedDate] = useState("2025-12-06")

    const slots = [
        { time: "9:00 AM", status: "Subscription", id: 1 },
        { time: "9:30 AM", status: "Subscription", id: 2 },
        { time: "10:00 AM", status: "Appointment", id: 3 },
        { time: "10:30 AM", status: "Available", id: 4 },
        { time: "11:00 AM", status: "Available", id: 5 },
        { time: "11:30 AM", status: "Available", id: 6 },
        { time: "12:00 PM", status: "Subscription", id: 7 },
        { time: "12:30 PM", status: "Available", id: 8 },
        { time: "1:00 PM", status: "Available", id: 9 },
        { time: "1:30 PM", status: "Available", id: 10 },
        { time: "2:00 PM", status: "Appointment", id: 11 },
        { time: "2:30 PM", status: "Available", id: 12 },
        { time: "3:00 PM", status: "Available", id: 13 },
        { time: "3:30 PM", status: "Available", id: 14 },
        { time: "4:00 PM", status: "Available", id: 15 },
        { time: "4:30 PM", status: "Available", id: 16 },
        { time: "5:00 PM", status: "Subscription", id: 17 },
        { time: "5:30 PM", status: "Available", id: 18 },
        { time: "6:00 PM", status: "Subscription", id: 19 },
        { time: "6:30 PM", status: "Available", id: 20 },
        { time: "7:00 PM", status: "Appointment", id: 21 },
        { time: "7:30 PM", status: "Available", id: 22 },
        { time: "8:00 PM", status: "Subscription", id: 23 },
        { time: "8:30 PM", status: "Available", id: 24 },
        { time: "9:00 PM", status: "Available", id: 25 },
        { time: "9:30 PM", status: "Available", id: 26 },
        { time: "10:00 PM", status: "Available", id: 27 },
        { time: "10:30 PM", status: "Blocked", id: 28 },
    ]

    return (
        <div className="min-h-screen bg-gray-50 text-[#002B49]">
            <DoctorHeader />
            <DoctorPageContainer title="Available Timings">
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
                    activeSection="timings"
                />

                <div className="flex-1 space-y-8">
                    {/* Top Level Calendar Selection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <h2 className="text-xl font-bold font-inter">Select Date</h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold">
                                    <CalendarIcon size={14} className="text-blue-600" />
                                    <span>08/04/2020 - 08/11/2020</span>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold">
                                    <Filter size={14} className="text-blue-600" />
                                    Filter By <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-12 mb-6 ml-4">
                                <button className="text-gray-400 hover:text-gray-900 transition"><ChevronLeftIcon size={18} /></button>
                                <span className="text-base font-bold min-w-[100px] text-center">December</span>
                                <button className="text-gray-400 hover:text-gray-900 transition"><ChevronRightIcon size={18} /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                                {['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((d, idx) => (
                                    <span key={`${d}-${idx}`} className="text-xs font-black text-gray-400 py-2">{d}</span>
                                ))}
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <button
                                        key={day}
                                        className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-black transition ${day === 6 ? 'bg-[#FED141] text-[#002B49] shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Day View and Summary Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Slots Selection Grid */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={18} className="text-blue-600" />
                                    <h3 className="text-base font-bold">6th Dec 2025</h3>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-blue-100 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                    <Filter size={14} /> Filter By <ChevronDown size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
                                {slots.map(slot => (
                                    <div
                                        key={slot.id}
                                        className={`px-3 py-2.5 rounded-md border text-[10px] font-black text-center transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer uppercase tracking-tighter hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-md ${slot.status === 'Subscription' ? 'bg-[#FED141] border-[#E8C040] text-[#002B49] hover:bg-[#ffe07a]' :
                                            slot.status === 'Appointment' ? 'bg-[#FF6B35] border-[#E05B2A] text-white hover:bg-[#ff8c61]' :
                                                slot.status === 'Blocked' ? 'bg-[#002B49] border-[#001D32] text-white hover:bg-[#003B69]' :
                                                    'bg-[#E5E7EB] border-gray-300 text-gray-500 hover:bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full border border-black/10 transition-colors ${slot.status === 'Available' ? 'bg-transparent border-gray-400' : 'bg-[#002B49]/30'}`} />
                                        {slot.time}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 mb-12">
                                <button className="px-4 py-2.5 bg-[#F3F4F6] text-gray-600 text-[10px] font-black uppercase rounded-md border border-gray-200 hover:bg-gray-200 transition">Mark as Available</button>
                                <button className="px-4 py-2.5 bg-[#F3F4F6] text-gray-600 text-[10px] font-black uppercase rounded-md border border-gray-200 hover:bg-gray-200 transition">Mark As Unavailable</button>
                                <button className="px-4 py-2.5 bg-[#F3F4F6] text-gray-600 text-[10px] font-black uppercase rounded-md border border-gray-200 hover:bg-gray-200 transition">Mark As Block</button>
                                <button className="px-4 py-2.5 bg-[#FED141] text-[#002B49] text-[10px] font-black uppercase rounded-md border border-[#E8C040] hover:bg-yellow-500 transition shadow-sm">Mark as Subscription</button>
                                <button className="px-4 py-2.5 bg-[#F3F4F6] text-gray-600 text-[10px] font-black uppercase rounded-md border border-gray-200 hover:bg-gray-200 transition">Remove Slot</button>
                                <button className="px-4 py-2.5 bg-[#1E6BFF] text-white text-[10px] font-black uppercase rounded-md shadow-md border border-blue-600 hover:bg-blue-600 transition">Custom more</button>
                            </div>

                            <div className="pt-10 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Customs for making Extras</h4>
                                    <button className="text-[10px] font-black text-[#1E6BFF] uppercase tracking-widest">Add More +</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Start Time *</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-xs font-black bg-white appearance-none"><option>hour</option></select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                            <div className="relative flex-1">
                                                <select className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-xs font-black bg-white appearance-none"><option>min</option></select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Start Time *</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-xs font-black bg-white appearance-none"><option>hour</option></select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                            <div className="relative flex-1">
                                                <select className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-xs font-black bg-white appearance-none"><option>min</option></select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Duration *</label>
                                        <input type="text" placeholder="Per Meet" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs font-black bg-white placeholder:text-gray-300" />
                                    </div>
                                </div>
                                <button className="px-16 py-3.5 bg-[#1E6BFF] text-white text-[10px] font-black uppercase rounded-lg shadow-xl hover:bg-blue-600 transition tracking-[0.2em]">Apply</button>
                            </div>
                        </div>

                        {/* Right Summary Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-sm transition-all border-[#FF6B35] border-2 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#FF6B35] rounded-xs" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest">Appointments</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-sm transition-all border-[#FED141] border-2 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#FED141] rounded-xs" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#FED141] uppercase tracking-widest">Subscriptions</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-sm transition-all border-[#002B49] border-2 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#002B49] rounded-xs" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#002B49] uppercase tracking-widest">Blocked</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
                                <h4 className="text-xs font-black text-center text-gray-900 uppercase tracking-[0.1em] border-b border-gray-100 pb-5">Task On 06th Dec 2025</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[11px] font-black text-[#002B49] uppercase tracking-widest">Appointments</h5>
                                        <button className="text-[9px] font-black text-[#1E6BFF] uppercase tracking-widest">View All</button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">• 10:00 AM , 2:00 AM, 7:00 AM</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[11px] font-black text-[#002B49] uppercase tracking-widest">Subscriptions</h5>
                                        <button className="text-[9px] font-black text-[#1E6BFF] uppercase tracking-widest">View All</button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-tighter">• 9:00 AM , 9:30 AM, 12:00 PM, 5:00 PM, 6:00 PM, 8:00 PM</p>
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
