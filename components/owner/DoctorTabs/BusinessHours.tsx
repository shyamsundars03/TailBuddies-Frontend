"use client"

import { Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils/utils"

export function BusinessHours() {
    const hours = [
        { day: "Monday", time: "9:30 AM – 7:00 PM", active: true },
        { day: "Tuesday", time: "9:30 AM – 7:00 PM", active: true },
        { day: "Wednesday", time: "9:30 AM – 8:00 PM", active: true },
        { day: "Thursday", time: "9:30 AM – 7:00 PM", active: true },
        { day: "Friday", time: "9:30 AM – 7:00 PM", active: true },
        { day: "Saturday", time: "9:30 AM – 7:00 PM", active: true },
        { day: "Sunday", time: "9:30 AM – 5:00 PM", active: false }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">Working Hours</h3>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Check availability before you visit</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm shadow-emerald-50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Open Now</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-950 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-950/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <Clock size={48} className="text-blue-400/50 mb-4" />
                    <h4 className="text-2xl font-black uppercase tracking-tight">Today's Schedule</h4>
                    <div className="space-y-1">
                        <p className="text-blue-200 font-bold text-xs uppercase tracking-widest">Wednesday</p>
                        <p className="text-3xl font-black">9:30 AM – 8:00 PM</p>
                    </div>
                    <div className="pt-4 flex items-center gap-3">
                        <Calendar size={18} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Current Date: 11 Mar 2025</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="space-y-5">
                        {hours.map((item) => (
                            <div key={item.day} className="flex items-center justify-between group">
                                <span className={cn(
                                    "text-xs font-black uppercase tracking-widest transition-colors",
                                    item.day === "Wednesday" ? "text-blue-600" : "text-gray-400 group-hover:text-blue-950"
                                )}>
                                    {item.day}
                                </span>
                                <div className="flex-1 border-b border-dotted border-gray-100 mx-4"></div>
                                <span className={cn(
                                    "text-xs font-bold transition-colors",
                                    item.day === "Wednesday" ? "text-blue-950" : "text-gray-500 group-hover:text-blue-950"
                                )}>
                                    {item.time}
                                </span>
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
