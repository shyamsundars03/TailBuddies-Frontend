"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils/utils"

// Formats "09:00" → "9:00 AM", "17:30" → "5:30 PM"
function formatTime(time: string): string {
    try {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    } catch {
        return time
    }
}

export function BusinessHours({ doctor }: { doctor: any }) {
    const workingHours = doctor?.businessHours || []
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    // Map each day to a display object derived from the slots array
    const hoursDisplay = days.map(day => {
        const dayInfo = workingHours.find((h: any) => h.day === day)
        const slots: string[] = dayInfo?.slots ?? []
        const isWorking = !!dayInfo?.isWorking && slots.length > 0

        // First slot = open time, last slot = last appointment start
        // We display the range as "first – last"
        const firstSlot = slots[0]
        const lastSlot = slots[slots.length - 1]

        return {
            day,
            time: isWorking
                ? `${formatTime(firstSlot)} – ${formatTime(lastSlot)}`
                : "Closed",
            slotCount: slots.length,
            active: isWorking
        }
    })

    const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())
    const todayInfo = hoursDisplay.find(h => h.day === todayDay)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">Working Hours</h3>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Check availability before you visit</p>
                </div>
                <div className={cn(
                    "px-4 py-2 rounded-xl flex items-center gap-2 border shadow-sm",
                    todayInfo?.active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                    <div className={cn("w-2 h-2 rounded-full", todayInfo?.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500")}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{todayInfo?.active ? "Open Now" : "Closed"}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today's schedule highlight card */}
                <div className="bg-blue-950 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-950/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <Clock size={48} className="text-blue-400/50 mb-4" />
                    <h4 className="text-2xl font-black uppercase tracking-tight">Today's Schedule</h4>
                    <div className="space-y-1">
                        <p className="text-blue-200 font-bold text-xs uppercase tracking-widest">{todayDay}</p>
                        <p className="text-3xl font-black">{todayInfo?.time || "Closed"}</p>
                        {todayInfo?.active && (
                            <p className="text-blue-300 text-xs font-semibold mt-1">
                                {todayInfo.slotCount} slot{todayInfo.slotCount !== 1 ? 's' : ''} available
                            </p>
                        )}
                    </div>
                </div>

                {/* Weekly overview */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="space-y-5">
                        {hoursDisplay.map((item) => (
                            <div key={item.day} className="flex items-center justify-between group">
                                <span className={cn(
                                    "text-xs font-black uppercase tracking-widest transition-colors",
                                    item.day === todayDay ? "text-blue-600" : "text-gray-400 group-hover:text-blue-950"
                                )}>
                                    {item.day}
                                </span>
                                <div className="flex-1 border-b border-dotted border-gray-100 mx-4"></div>
                                <div className="flex items-center gap-2">
                                    {item.active && (
                                        <span className="text-[9px] font-bold text-gray-300">
                                            {item.slotCount} slots
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-xs font-bold transition-colors",
                                        item.active
                                            ? item.day === todayDay ? "text-blue-950" : "text-gray-700 group-hover:text-blue-950"
                                            : "text-rose-400"
                                    )}>
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-950 shadow-sm relative shrink-0">
                    <Clock size={20} />
                </div>
                <p className="text-xs font-bold text-yellow-800 uppercase leading-relaxed">
                    Note: Working hours may vary on public holidays and special occasions. Please contact the doctor office for specific details.
                </p>
            </div>
        </div>
    )
}
