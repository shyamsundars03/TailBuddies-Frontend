"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, User, Search, ChevronRight, PawPrint, Loader2 } from "lucide-react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar-custom.css'
import { appointmentApi } from "@/lib/api/appointment.api"
import { format, isSameDay, isAfter, parse } from "date-fns"
import { cn } from "@/lib/utils/utils"
import Image from "next/image"
import Link from "next/link"
import { slotApi } from "@/lib/api/slot.api"
import { toast } from "sonner"
import Swal from "sweetalert2"

export default function DoctorCalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [slots, setSlots] = useState<any[]>([])
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")


    useEffect(() => {
        fetchAppointments()
    }, [])

    useEffect(() => {
        setSelectedSlotIds([])
        fetchSlots()
    }, [selectedDate])

    const toggleSlotSelection = (slot: any) => {
        if (slot.status === 'cancelled') return;

        // Check if slot is in the future
        const slotTime = parse(slot.startTime, 'HH:mm', selectedDate);
        if (!isAfter(slotTime, new Date())) {
            toast.error("Cannot select past slots");
            return;
        }

        setSelectedSlotIds(prev =>
            prev.includes(slot._id)
                ? prev.filter(id => id !== slot._id)
                : [...prev, slot._id]
        )
    }

    const handleBlockSlots = async () => {
        if (selectedSlotIds.length === 0) return;

        const selectedSlotsData = slots.filter(s => selectedSlotIds.includes(s._id));
        const hasBooked = selectedSlotsData.some(s => s.isBooked && !s.isBlocked);

        if (hasBooked) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Some selected slots have booked appointments. Blocking them will cancel the appointments and notify the users.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#002B49',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, block and cancel!'
            });

            if (!result.isConfirmed) return;
        }

        setIsActionLoading(true);
        const response = await slotApi.blockSlots(selectedSlotIds);
        if (response.success) {
            toast.success(response.message || "Slots blocked successfully");
            setSelectedSlotIds([]);
            fetchSlots();
        } else {
            toast.error(response.message || "Failed to block slots");
        }
        setIsActionLoading(false);
    }

    const handleUnblockSlots = async () => {
        if (selectedSlotIds.length === 0) return;

        setIsActionLoading(true);
        const response = await slotApi.unblockSlots(selectedSlotIds);
        if (response.success) {
            toast.success(response.message || "Slots unblocked successfully");
            setSelectedSlotIds([]);
            fetchSlots();
        } else {
            toast.error(response.message || "Failed to unblock slots");
        }
        setIsActionLoading(false);
    }

    const fetchAppointments = async () => {

        setIsLoading(true)
        const response = await appointmentApi.getDoctorAppointments(undefined, 1, 100)
        if (response.success) {
            setAppointments(response.data || [])
        }
        setIsLoading(false)
    }

    const fetchSlots = async () => {
        setIsLoadingSlots(true)
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const response = await appointmentApi.getDoctorSlots(dateStr)
        if (response.success) {
            setSlots(response.data || [])
        }
        setIsLoadingSlots(false)
    }

    const dayAppointments = appointments.filter(appt =>
        isSameDay(new Date(appt.appointmentDate), selectedDate)
    ).filter(appt =>
        appt.petId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.appointmentId?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const hasAppointments = (date: Date) => {
        return appointments.some(appt => isSameDay(new Date(appt.appointmentDate), date))
    }

    const getSlotColor = (slot: any) => {
        const status = slot.status?.toLowerCase();
        const mode = slot.mode?.toLowerCase();

        if (status === 'appointment' || slot.isBooked) {
            if (mode === 'online') {
                return 'bg-[#FED141] border-[#E8C040] text-[#002B49] hover:bg-[#ffe07a]';
            }
            return 'bg-[#FF6B35] border-[#E05B2A] text-white hover:bg-[#ff8c61]';
        }
        
        if (status === 'subscription') return 'bg-[#FED141] border-[#E8C040] text-[#002B49] hover:bg-[#ffe07a]';
        if (status === 'blocked' || slot.isBlocked) return 'bg-[#002B49] border-[#001D32] text-white hover:bg-[#003B69]';
        
        if (status === 'cancelled') return 'bg-red-500 border-red-600 text-white hover:bg-red-600';
        
        return 'bg-[#E5E7EB] border-gray-300 text-gray-500 hover:bg-gray-300';
    }

    return (
        <div className="w-full space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Schedule Calendar</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Calendar & Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 p-6 overflow-hidden">
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

                    <div className="bg-linear-to-br from-[#002B49] to-[#003B69] rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black uppercase tracking-widest">Day Summary</h3>
                            <CalendarIcon size={20} className="text-blue-200" />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-blue-100 uppercase tracking-tight">Total Appointments</span>
                                <span className="text-3xl font-black">{dayAppointments.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-blue-100 uppercase tracking-tight">Slots Status</span>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                                        <span className="text-[10px] font-bold">Offline</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#FED141]" />
                                        <span className="text-[10px] font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Selected Date</p>
                                <p className="text-lg font-black">{format(selectedDate, 'EEEE, dd MMMM yyyy')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Slots & Timeline */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Slot Grid Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#002B49] uppercase tracking-widest flex items-center gap-3">
                                <Clock className="text-blue-600" size={24} />
                                Available Slots
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase">
                                    {format(selectedDate, 'dd MMM yyyy')}
                                </span>
                            </div>
                        </div>

                        {isLoadingSlots ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : slots.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                                {slots.map((slot, idx) => {
                                    const isSelected = selectedSlotIds.includes(slot._id);
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => toggleSlotSelection(slot)}
                                            className={cn(
                                                "px-3 py-2.5 rounded-lg border text-[10px] font-black text-center transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer uppercase tracking-tighter hover:scale-[1.03] active:scale-95 shadow-sm",
                                                getSlotColor(slot),
                                                isSelected && "ring-2 ring-offset-2 ring-blue-500 scale-[1.05] shadow-lg border-blue-500"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full border border-black/10 transition-colors",
                                                isSelected ? "bg-white" : 
                                                slot.status === 'Available' ? 'bg-transparent border-gray-400' : 'bg-[#002B49]/30'
                                            )} />
                                            {slot.startTime}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No slots generated for this date</p>
                                <button className="mt-4 text-[10px] font-black text-blue-600 uppercase hover:underline">Generate Default Slots</button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={handleBlockSlots}
                                disabled={selectedSlotIds.length === 0 || isActionLoading}
                                className="px-4 py-2.5 bg-[#002B49] text-white text-[10px] font-black uppercase rounded-xl border border-[#001D32] hover:bg-opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isActionLoading && <Loader2 size={12} className="animate-spin" />}
                                Mark As Block
                            </button>
                            <button 
                                onClick={handleUnblockSlots}
                                disabled={selectedSlotIds.length === 0 || isActionLoading}
                                className="px-4 py-2.5 bg-white text-[#002B49] text-[10px] font-black uppercase rounded-xl border border-[#002B49] hover:bg-gray-50 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isActionLoading && <Loader2 size={12} className="animate-spin" />}
                                Mark As Unblock
                            </button>
                        </div>

                    </div>

                    {/* Timeline Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 p-6 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#002B49] uppercase tracking-widest flex items-center gap-3">
                                <Search className="text-blue-600" size={24} />
                                Appointments Timeline
                            </h3>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search pets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase tracking-tight"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing Appointments...</p>
                                </div>
                            ) : dayAppointments.length > 0 ? (
                                dayAppointments.sort((a, b) => a.appointmentStartTime.localeCompare(b.appointmentStartTime)).map((appt, idx) => (
                                    <div key={idx} className="group flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs font-black text-blue-600 uppercase w-16 text-right pt-4">
                                                {appt.appointmentStartTime}
                                            </div>
                                            <div className="w-px h-full bg-gray-100 relative my-2">
                                                <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                                            </div>
                                        </div>

                                        <Link
                                            href={`/doctor/appointments/${appt._id}`}
                                            className="flex-1 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 border border-transparent hover:border-blue-50 rounded-2xl p-5 transition-all cursor-pointer group/card"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                                        <Image
                                                            src={appt.petId?.picture || "/placeholder.svg?height=48&width=48"}
                                                            alt="Pet"
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-[#002B49] text-sm uppercase tracking-tight">{appt.petId?.name || "Unknown Pet"}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <PawPrint size={10} />
                                                                {appt.petId?.species || "Pet"} • {appt.serviceType || "Consultation"}
                                                            </p>
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                                                appt.mode === 'online' ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"
                                                            )}>
                                                                {appt.mode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                    appt.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                                                        appt.status === 'booked' ? "bg-blue-100 text-blue-600" :
                                                            appt.status === 'completed' ? "bg-gray-100 text-gray-600" :
                                                                "bg-rose-100 text-rose-600"
                                                )}>
                                                    {appt.status}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100/50">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Owner: {appt.ownerId?.username || "Owner"}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    View Details
                                                    <ChevronRight size={12} />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <CalendarIcon size={32} className="text-gray-200" />
                                    </div>
                                    <h4 className="font-black text-[#002B49] uppercase tracking-widest mb-2">Quiet Day!</h4>
                                    <p className="text-xs text-gray-400 font-medium">No appointments scheduled for this date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
