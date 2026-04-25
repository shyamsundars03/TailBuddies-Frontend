"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, Search, ChevronRight, PawPrint, Loader2, Stethoscope } from "lucide-react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '@/app/(doctor)/doctor/calendar/calendar-custom.css'
import { appointmentApi } from "@/lib/api/appointment.api"
import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils/utils"
import Image from "next/image"

export default function OwnerCalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        setIsLoading(true)
        const response = await appointmentApi.getOwnerAppointments(1, 100) 
        if (response.success) {
            setAppointments(response.data || [])
        }
        setIsLoading(false)
    }

    const dayAppointments = appointments.filter(appt => 
        isSameDay(new Date(appt.appointmentDate), selectedDate)
    ).filter(appt => 
        appt.doctorId?.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.petId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const hasAppointments = (date: Date) => {
        return appointments.some(appt => isSameDay(new Date(appt.appointmentDate), date))
    }

    return (
        <div className="w-full space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">My Calendar</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Calendar */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-6 overflow-hidden">
                        <Calendar 
                            onChange={(val) => setSelectedDate(val as Date)} 
                            value={selectedDate}
                            tileClassName={({ date, view }) => {
                                if (view === 'month' && hasAppointments(date)) {
                                    return 'has-appointments'
                                }
                                return null
                            }}
                            className="w-full border-none font-bold"
                        />
                    </div>

                    <div className="bg-linear-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black uppercase tracking-widest">Pet Schedule</h3>
                            <CalendarIcon size={20} className="text-indigo-200" />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-indigo-100 uppercase tracking-tight">Active Bookings</span>
                                <span className="text-3xl font-black">{dayAppointments.length}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Selected Date</p>
                                <p className="text-lg font-black">{format(selectedDate, 'EEEE, dd MMMM yyyy')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Events List */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-6 flex flex-col h-[700px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#002B49] uppercase tracking-widest flex items-center gap-3">
                                <Clock className="text-indigo-600" size={24} />
                                Timeline
                            </h3>
                            <div className="relative w-64">
                                <input 
                                    type="text" 
                                    placeholder="Search doctor or pet..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Events...</p>
                                </div>
                            ) : dayAppointments.length > 0 ? (
                                dayAppointments.sort((a,b) => a.appointmentStartTime.localeCompare(b.appointmentStartTime)).map((appt, idx) => (
                                    <div key={idx} className="group flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs font-black text-indigo-600 uppercase w-16 text-right pt-4">
                                                {appt.appointmentStartTime}
                                            </div>
                                            <div className="w-px h-full bg-gray-100 relative my-2">
                                                <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-100 border border-transparent hover:border-indigo-50 rounded-2xl p-5 transition-all cursor-pointer group/card">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                                        <Image 
                                                            src={appt.petId?.image || "/placeholder-pet.png"} 
                                                            alt="Pet" 
                                                            width={48} 
                                                            height={48} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-[#002B49] text-sm uppercase tracking-tight">{appt.petId?.name || "My Pet"}</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                            <PawPrint size={10} />
                                                            {appt.serviceType || "Consultation"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                    appt.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                                                    appt.status === 'booked' ? "bg-indigo-100 text-indigo-600" :
                                                    appt.status === 'completed' ? "bg-gray-100 text-gray-600" :
                                                    "bg-rose-100 text-rose-600"
                                                )}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100/50">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Dr. {appt.doctorId?.userId?.username || "Doctor"}</span>
                                                </div>
                                                <button className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    View Details
                                                    <ChevronRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <CalendarIcon size={32} className="text-gray-200" />
                                    </div>
                                    <h4 className="font-black text-[#002B49] uppercase tracking-widest mb-2">Free Day!</h4>
                                    <p className="text-xs text-gray-400 font-medium">No pet appointments for this date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
