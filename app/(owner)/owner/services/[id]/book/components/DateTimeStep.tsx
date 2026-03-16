"use client"

import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils/utils"

const DAYS = [
    { id: "MON", label: "MON", date: "11 NOV 2019" },
    { id: "TUE", label: "TUE", date: "12 NOV 2019" },
    { id: "WED", label: "WED", date: "13 NOV 2019" },
    { id: "THU", label: "THU", date: "14 NOV 2019" },
    { id: "FRI", label: "FRI", date: "15 NOV 2019" },
    { id: "SAT", label: "SAT", date: "16 NOV 2019" },
    { id: "SUN", label: "SUN", date: "17 NOV 2019" }
]

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM"]

export function DateTimeStep({ data, setData }: { data: any, setData: any }) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-blue-950">11 November 2019</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monday</p>
                </div>
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-100 px-6 py-2.5 rounded-lg text-xs font-bold text-gray-500 pr-10 hover:border-blue-200 transition-colors focus:outline-none shadow-sm">
                        <option>08/10/2020 - 08/11/2020</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full -ml-4 border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
                        <ChevronLeft size={16} />
                    </button>
                    {DAYS.map((day) => (
                        <div key={day.id} className="p-4 text-center space-y-1 border-r border-gray-50 last:border-r-0">
                            <p className="text-[10px] font-black text-blue-950 uppercase tracking-widest">{day.label}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">{day.date}</p>
                        </div>
                    ))}
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full -mr-4 border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-7">
                    {DAYS.map((day) => (
                        <div key={`slots-${day.id}`} className="p-3 space-y-2 border-r border-gray-50 last:border-r-0">
                            {TIME_SLOTS.map((slot) => {
                                const isSelected = data.time === slot && data.date === day.date
                                return (
                                    <button
                                        key={`${day.id}-${slot}`}
                                        onClick={() => setData({ ...data, time: slot, date: day.date })}
                                        className={cn(
                                            "w-full py-2.5 rounded text-[10px] font-bold transition-all duration-300",
                                            isSelected
                                                ? "bg-blue-600 text-white shadow-md scale-105"
                                                : "bg-gray-100/50 text-gray-500 hover:bg-gray-100"
                                        )}
                                    >
                                        {slot}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-6 pt-4">
                <h3 className="text-center text-[10px] font-black text-blue-950 uppercase tracking-[0.2em]">Consultation Mode</h3>
                <div className="flex justify-center gap-6">
                    <button className="flex items-center gap-2 bg-yellow-400 text-blue-950 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-yellow-100 hover:scale-105 transition-transform active:scale-95">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-950 bg-white shadow-inner"></div>
                        Online
                    </button>
                    <button className="flex items-center gap-2 bg-yellow-400 text-blue-950 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-yellow-100 hover:scale-105 transition-transform active:scale-95">
                        <div className="w-2.5 h-2.5 rounded-full border border-blue-950/20 bg-white"></div>
                        Offline
                    </button>
                </div>
            </div>
        </div>
    )
}
