"use client"

import React, { useState, useEffect } from 'react'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { Clock, CheckCircle2, Circle, AlertCircle, RefreshCw, Copy, ChevronDown, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface BusinessHoursProps {
    doctor: any;
    onUpdate?: (data: any) => void;
    isEditable?: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIME_OPTIONS = Array.from({ length: 24 * 4 }).map((_, i) => {
    const hours = Math.floor(i / 4).toString().padStart(2, '0')
    const minutes = ((i % 4) * 15).toString().padStart(2, '0')
    return `${hours}:${minutes}`
})

export const BusinessHoursTab = ({ doctor, onUpdate, isEditable = true }: BusinessHoursProps) => {
    const [businessHours, setBusinessHours] = useState<any[]>(
        DAYS.map(day => ({ 
            day, 
            isWorking: true, 
            slots: [],
            startTime: "09:00",
            endTime: "17:00",
            duration: "30"
        }))
    )
    const [activeTab, setActiveTab] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeMode, setActiveMode] = useState<"all" | "weekdays" | "custom">("all")
    
    // Global config
    const [genConfig, setGenConfig] = useState({
        startTime: "09:00",
        endTime: "17:00",
        duration: "30",
    })
    
    const [startDate, setStartDate] = useState(() => {
        const d = new Date()
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${dd}`
    })
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        if (doctor?.businessHours && doctor.businessHours.length > 0) {
            const merged = DAYS.map(day => {
                const existing = doctor.businessHours.find((bh: any) => bh.day === day)
                if (existing) {
                    return {
                        ...existing,
                        startTime: existing.startTime,
                        endTime: existing.endTime,
                        duration: existing.duration,
                        isWorking: existing.isWorking,
                        slots: existing.slots || []
                    }
                }
                return { 
                    day, 
                    isWorking: false, 
                    slots: [],
                    startTime: "09:00",
                    endTime: "17:00",
                    duration: "30"
                }
            })
            setBusinessHours(merged)
            
            // Sync genConfig with first working day if available
            const firstWorking = merged.find(d => d.isWorking)
            if (firstWorking) {
                setGenConfig({
                    startTime: firstWorking.startTime,
                    endTime: firstWorking.endTime,
                    duration: firstWorking.duration
                })
            }

            // Infer mode if possible
            const workingDays = merged.filter(d => d.isWorking)
            if (workingDays.length === 5 && workingDays.every(d => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(d.day))) {
                setActiveMode("weekdays")
            } else if (workingDays.length === 7) {
                setActiveMode("all")
            } else {
                setActiveMode("custom")
            }
        }

        if (doctor?.recurringSchedules && doctor.recurringSchedules.length > 0) {
            const first = doctor.recurringSchedules[0]
            if (first.dtstart) {
                const d = new Date(first.dtstart)
                const y = d.getFullYear()
                const m = String(d.getMonth() + 1).padStart(2, '0')
                const dd = String(d.getDate()).padStart(2, '0')
                setStartDate(`${y}-${m}-${dd}`)
            }
            if (first.dtend) {
                const d = new Date(first.dtend)
                const y = d.getFullYear()
                const m = String(d.getMonth() + 1).padStart(2, '0')
                const dd = String(d.getDate()).padStart(2, '0')
                setEndDate(`${y}-${m}-${dd}`)
            }
        }
    }, [doctor])

    const generateSlotsForDay = (start: string, end: string, durationMin: number) => {
        const slots: string[] = []
        try {
            let current = new Date(`2000-01-01T${start}:00`)
            const endDay = new Date(`2000-01-01T${end}:00`)
            if (current >= endDay) return []
            const PLATFORM_BUFFER = 10;
            while (current <= endDay) {
                slots.push(current.toTimeString().slice(0, 5))
                current = new Date(current.getTime() + (durationMin + PLATFORM_BUFFER) * 60000)
            }
        } catch (e) { return [] }
        return slots
    }

    const handleApplyMode = (mode: "all" | "weekdays" | "custom") => {
        setActiveMode(mode)
        if (mode === "custom") return

        const newSlots = generateSlotsForDay(genConfig.startTime, genConfig.endTime, parseInt(genConfig.duration))
        const updated = businessHours.map(bh => {
            const shouldWork = mode === "all" || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(bh.day)
            return {
                ...bh,
                isWorking: shouldWork,
                slots: shouldWork ? [...newSlots] : [],
                startTime: genConfig.startTime,
                endTime: genConfig.endTime,
                duration: genConfig.duration
            }
        })
        setBusinessHours(updated)
        toast.success(`Applied ${mode === "all" ? "to all days" : "to Mon-Fri"}`)
    }

    const handleRegenerateDay = (idx: number) => {
        const day = businessHours[idx]
        const newSlots = generateSlotsForDay(day.startTime, day.endTime, parseInt(day.duration))
        const updated = [...businessHours]
        updated[idx] = { ...day, slots: newSlots, isWorking: true }
        setBusinessHours(updated)
        toast.success(`Slots updated for ${day.day}`)
    }

    const handleSave = async () => {
        setIsSubmitting(true)
        try {
            // Dynamically generate RRule BYDAY string based on working days
            const dayMap: { [key: string]: string } = {
                "Monday": "MO", "Tuesday": "TU", "Wednesday": "WE", 
                "Thursday": "TH", "Friday": "FR", "Saturday": "SA", "Sunday": "SU"
            }
            const activeDays = businessHours
                .filter(bh => bh.isWorking)
                .map(bh => dayMap[bh.day])
                .join(',')

            const rruleString = `FREQ=WEEKLY;BYDAY=${activeDays || "MO,TU,WE,TH,FR"}`

            // Prepare the save payload
            const payload: any = { 
                businessHours: businessHours.map(bh => ({
                    day: bh.day,
                    isWorking: bh.isWorking,
                    startTime: bh.startTime || "09:00",
                    endTime: bh.endTime || "17:00",
                    duration: bh.duration || "30",
                    slots: bh.slots
                })),
                recurringSchedules: [{
                    id: "default",
                    rrule: rruleString,
                    dtstart: new Date(startDate),
                    dtend: endDate ? new Date(endDate) : undefined,
                    isWorking: true,
                    startTime: genConfig.startTime || "09:00",
                    endTime: genConfig.endTime || "17:00"
                }]
            }

            // Also sync appointmentDuration with the global duration if applicable
            if (genConfig.duration) {
                payload.appointmentDuration = parseInt(genConfig.duration)
            }

            const response = await doctorApi.updateProfile(payload)
            if (response.success) {
                toast.success("Business hours saved successfully")
                if (onUpdate) onUpdate(response.data)
                
                // Immediately sync local state with response to avoid defaults overwrite
                if (response.data?.businessHours) {
                    const merged = DAYS.map(day => {
                        const existing = response.data.businessHours.find((bh: any) => bh.day === day)
                        if (existing) {
                            return {
                                ...existing,
                                startTime: existing.startTime,
                                endTime: existing.endTime,
                                duration: existing.duration,
                                isWorking: existing.isWorking,
                                slots: existing.slots || []
                            }
                        }
                        return { day, isWorking: false, slots: [], startTime: "09:00", endTime: "17:00", duration: "30" }
                    })
                    setBusinessHours(merged)
                }
            } else {
                toast.error(response.error || "Failed to save business hours")
            }
        } catch (error) {
            toast.error("An error occurred while saving")
        } finally {
            setIsSubmitting(false)
        }
    }

    const currentDay = businessHours[activeTab]

    return (
        <div className="space-y-4 max-w-4xl mx-auto pb-4">
            <div className="border-b border-gray-100 pb-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Availability</h2>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5 tracking-wide">SET CLINIC TIMINGS</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate || ""}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date (Optional)</label>
                        <input
                            type="date"
                            value={endDate || ""}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Global Configuration Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
                <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        Quick Setup
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Open</label>
                            <input
                                type="time"
                                value={genConfig.startTime || ""}
                                onChange={(e) => setGenConfig({...genConfig, startTime: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Close</label>
                            <input
                                type="time"
                                value={genConfig.endTime || ""}
                                onChange={(e) => setGenConfig({...genConfig, endTime: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Slot Duration</label>
                            <select
                                value={genConfig.duration || "30"}
                                onChange={(e) => setGenConfig({...genConfig, duration: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                <option value="30">30 Min (+ 10m break)</option>
                                <option value="45">45 Min (+ 10m break)</option>
                                <option value="60">1 Hour (+ 10m break)</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-[8px] text-blue-600 font-bold tracking-tight">
                         * A platform-standard 10-minute buffer is automatically added between slots.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                    <button
                        onClick={() => handleApplyMode("all")}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            activeMode === "all" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        All Days
                    </button>
                    <button
                        onClick={() => handleApplyMode("weekdays")}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            activeMode === "weekdays" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        Mon - Fri
                    </button>
                    <button
                        onClick={() => handleApplyMode("custom")}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            activeMode === "custom" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        Custom
                    </button>
                </div>
            </div>

            {/* Days Tab Interface */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex overflow-x-auto gap-1.5 p-1 bg-gray-50 rounded-xl no-scrollbar border border-gray-100">
                        {businessHours.map((day, idx) => {
                            const isWeekend = ["Saturday", "Sunday"].includes(day.day)
                            const isDisabled = activeMode === "weekdays" && isWeekend
                            return (
                                <button
                                    key={idx}
                                    disabled={isDisabled}
                                    onClick={() => !isDisabled && setActiveTab(idx)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 text-center min-w-[70px]",
                                        activeTab === idx 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "bg-white text-gray-400 border border-gray-100 hover:text-gray-900",
                                        isDisabled && "opacity-20 grayscale cursor-not-allowed"
                                    )}
                                >
                                    {day.day.substring(0, 3)}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-h-[200px] relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">{currentDay.day}</h3>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                currentDay.isWorking ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                            )}>
                                {currentDay.isWorking ? "OPEN" : "CLOSED"}
                            </span>
                            <button
                                onClick={() => {
                                    const updated = [...businessHours]
                                    updated[activeTab].isWorking = !updated[activeTab].isWorking
                                    if (!updated[activeTab].isWorking) updated[activeTab].slots = []
                                    setBusinessHours(updated)
                                }}
                                className={cn(
                                    "w-8 h-4 rounded-full relative transition-all duration-300",
                                    currentDay.isWorking ? "bg-blue-600" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                    currentDay.isWorking ? "left-4.5" : "left-0.5"
                                )} />
                            </button>
                        </div>
                    </div>

                    {currentDay.isWorking && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Open</label>
                                    <input
                                        type="time"
                                        value={currentDay.startTime || ""}
                                        onChange={(e) => {
                                            const updated = [...businessHours]
                                            updated[activeTab].startTime = e.target.value
                                            setBusinessHours(updated)
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Close</label>
                                    <input
                                        type="time"
                                        value={currentDay.endTime || ""}
                                        onChange={(e) => {
                                            const updated = [...businessHours]
                                            updated[activeTab].endTime = e.target.value
                                            setBusinessHours(updated)
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                                    <select
                                        value={currentDay.duration || "30"}
                                        onChange={(e) => {
                                            const updated = [...businessHours]
                                            updated[activeTab].duration = e.target.value
                                            setBusinessHours(updated)
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option value="30">30 Min</option>
                                        <option value="45">45 Min</option>
                                        <option value="60">1 Hour</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h5 className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Available Slots</h5>
                                    <button 
                                        onClick={() => handleRegenerateDay(activeTab)}
                                        className="text-[8px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <RefreshCw size={8} /> Sync
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {currentDay.slots.map((slot: string, sIdx: number) => (
                                        <div 
                                            key={sIdx}
                                            className="group relative px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center gap-1 text-[9px] font-black text-gray-600 hover:border-blue-200 transition-all cursor-default"
                                        >
                                            {new Date(`2000-01-01T${slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            <button
                                                onClick={() => {
                                                    const updated = [...businessHours]
                                                    updated[activeTab].slots = updated[activeTab].slots.filter((_: any, i: number) => i !== sIdx)
                                                    setBusinessHours(updated)
                                                }}
                                                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 hover:scale-100"
                                            >
                                                <Circle size={4} fill="currentColor" />
                                            </button>
                                        </div>
                                    ))}
                                    {currentDay.slots.length === 0 && (
                                        <div className="w-full py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">No slots</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {!currentDay.isWorking && (
                        <div className="py-10 flex flex-col items-center justify-center text-center opacity-50">
                            <Clock size={24} className="text-gray-200 mb-2" />
                            <h4 className="text-[10px] font-black text-gray-300 uppercase">Closed</h4>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{currentDay.slots.length} Slots</p>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "WAIT..." : "SAVE TIMINGS"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Helper */}
            <div className="p-4 bg-gray-900 rounded-2xl text-white flex items-center gap-4">
                <ShieldCheck className="text-blue-400 shrink-0" size={20} />
                <p className="text-[9px] text-gray-400 font-medium leading-tight">
                    Accurate timings help prevent double bookings and improve patient trust.
                </p>
            </div>
        </div>
    )
}
