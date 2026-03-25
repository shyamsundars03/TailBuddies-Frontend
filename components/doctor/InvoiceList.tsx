"use client"

import { useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, User, MoreVertical } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

interface Invoice {
    id: string
    patientName: string
    appointmentId: string
    date: string
    time: string
    type: string
    mode: string
    amount: number
    expectedOn: string
    status: "Pending" | "Completed" | "Hold"
    avatar: string
}

export default function InvoicePage() {
    const [activeTab, setActiveTab] = useState("Upcoming")

    const invoices: Invoice[] = [
        {
            id: "1",
            patientName: "Adrian",
            appointmentId: "#Apt0001",
            date: "11 Nov 2025",
            time: "10.45 AM",
            type: "Subscription",
            mode: "Video Call",
            amount: 449,
            expectedOn: "11 Nov 2025",
            status: "Pending",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: "2",
            patientName: "Kelly",
            appointmentId: "#Apt0002",
            date: "05 Nov 2025",
            time: "11.50 AM",
            type: "General Visit",
            mode: "Offline",
            amount: 349,
            expectedOn: "27 Oct 2025",
            status: "Pending",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: "3",
            patientName: "Samuel",
            appointmentId: "#Apt0003",
            date: "27 Oct 2025",
            time: "09.30 AM",
            type: "General Visit",
            mode: "Video Call",
            amount: 349,
            expectedOn: "11 Oct 2025",
            status: "Pending",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: "4",
            patientName: "Peter",
            appointmentId: "#Apt0007",
            date: "14 Sep 2025",
            time: "08.10 AM",
            type: "Emergency",
            mode: "Offline",
            amount: 549,
            expectedOn: "11 Aug 2025",
            status: "Pending",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100"
        }
    ]

    return (
        <div className="space-y-8 pb-12 pr-4 pl-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Previous Week Earning</p>
                        <h3 className="text-3xl font-black text-[#002B49]">₹ 15000</h3>
                    </div>
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                        <User size={32} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">This Week Earning</p>
                        <h3 className="text-3xl font-black text-[#002B49]">9500</h3>
                        <p className="text-[10px] font-bold text-gray-400">All cleared 7-day hold period</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                        <User size={32} />
                    </div>
                </div>
            </div>

            {/* Recent Invoices Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-[#002B49] uppercase tracking-tight">Recent Invoices</h2>
                    </div>

                    {/* Tabs / Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex bg-gray-50/50 p-1.5 rounded-2xl w-fit">
                            {["Upcoming", "Hold", "Completed"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-2",
                                        activeTab === tab 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {tab}
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black",
                                        activeTab === tab ? "bg-white/20" : "bg-gray-100"
                                    )}>
                                        {tab === "Upcoming" ? "21" : tab === "Hold" ? "16" : "214"}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter size={16} className="text-[#002B49]" />
                            <span className="text-xs font-black text-[#002B49] uppercase tracking-widest">Filter By</span>
                            <MoreVertical size={16} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Invoice List */}
                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div 
                                key={inv.id} 
                                className="group flex flex-col md:flex-row md:items-center gap-6 p-5 bg-white border border-gray-50 rounded-3xl hover:bg-blue-50/30 hover:border-blue-100 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-gray-50 shrink-0">
                                        <Image src={inv.avatar} alt={inv.patientName} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{inv.appointmentId}</div>
                                        <h4 className="font-extrabold text-[#002B49] text-base truncate">{inv.patientName}</h4>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-12 gap-y-4 flex-[2]">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-black text-[#002B49]">
                                            <span className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">🕒</span>
                                            {inv.date} {inv.time}
                                        </div>
                                        <div className="flex items-center gap-2 pl-7 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                            {inv.type} • {inv.mode}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Amount</div>
                                        <div className="text-sm font-black text-[#002B49]">₹{inv.amount}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Expected On</div>
                                        <div className="text-sm font-black text-gray-400">{inv.expectedOn}</div>
                                    </div>
                                </div>

                                <div className="md:ml-auto">
                                    <span className="px-8 py-2.5 bg-purple-600 text-white text-[10px] font-black rounded-xl shadow-lg shadow-purple-500/30 uppercase tracking-[0.2em]">
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-8">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing 1 to 8 of 12 entries
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest">Previous</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-xs">1</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-400 text-gray-900 font-bold text-xs shadow-md">2</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-xs">3</button>
                            <button className="px-4 py-2 text-gray-900 hover:text-black font-bold text-xs uppercase tracking-widest">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
