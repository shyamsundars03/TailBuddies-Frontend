"use client"

import { useState } from "react"
import { Search, Calendar, Filter, List, Grid, ChevronLeft, ChevronRight, Eye, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

// Dummy data based on Image 5
const DUMMY_BOOKINGS = [
    {
        id: "Apt0001",
        doctor: "Dr Edalin",
        doctorImage: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150",
        date: "11 Nov 2025",
        time: "10.45 AM",
        petName: "Max",
        type: "General Visit",
        mode: "Video Call",
        status: "Upcoming",
        connectionStatus: "Online"
    },
    {
        id: "Apt0002",
        doctor: "Dr Shanta",
        doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150",
        date: "05 Nov 2025",
        time: "11.50 AM",
        petName: "Max",
        type: "General Visit",
        mode: "Video Call",
        status: "Upcoming",
        connectionStatus: "Online",
        isNew: true
    },
    {
        id: "Apt0003",
        doctor: "Dr John",
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150",
        date: "27 Oct 2025",
        time: "09.30 AM",
        petName: "Max",
        type: "General Visit",
        mode: "Video Call",
        status: "Upcoming",
        connectionStatus: "Online"
    }
]

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState("Upcoming")
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Bookings</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">My Bookings</span>
                    </nav>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-blue-900/80">Appointments</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-64"
                            />
                        </div>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm">
                                <List size={18} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600">
                                <Grid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <div className="flex gap-2">
                        <TabButton label="Upcoming" count={21} active={activeTab === "Upcoming"} onClick={() => setActiveTab("Upcoming")} />
                        <TabButton label="Cancelled" count={18} active={activeTab === "Cancelled"} onClick={() => setActiveTab("Cancelled")} />
                        <TabButton label="Completed" count={214} active={activeTab === "Completed"} onClick={() => setActiveTab("Completed")} />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                            <Calendar size={16} />
                            <span>08/04/2020 - 08/11/2020</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                            <Filter size={16} />
                            <span>Filter By</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {DUMMY_BOOKINGS.map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-gray-50 shadow-sm relative">
                                        <Image
                                            src={booking.doctorImage}
                                            alt={booking.doctor}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                        {booking.isNew && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500 font-medium text-xs">#{booking.id}</span>
                                            {booking.isNew && (
                                                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase italic">New</span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-lg">{booking.doctor}</h3>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={18} className="text-blue-500" />
                                        <span className="text-sm font-semibold">{booking.date} {booking.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-blue-950/70">{booking.type}</span>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <span className="text-xs font-bold text-blue-950/70">{booking.mode}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-400 mb-1">Pet Name</p>
                                    <p className="font-bold text-gray-800">{booking.petName}</p>
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-400 mb-1">Mode</p>
                                    <p className="font-bold text-gray-800">{booking.connectionStatus}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="px-6 py-2 border border-blue-400 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition">
                                        Cancel
                                    </button>
                                    <Link
                                        href={`/owner/bookings/${booking.id}`}
                                        className="px-6 py-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2"
                                    >
                                        <Eye size={16} />
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-8 pb-4">
                    <span className="text-sm text-gray-500 font-medium">Showing 1 to 8 of 12 entries</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600">Previous</button>
                        <button className="w-10 h-10 border border-gray-100 rounded-lg text-sm font-medium hover:bg-gray-50">1</button>
                        <button className="w-10 h-10 bg-yellow-400 text-black rounded-lg text-sm font-bold shadow-sm">2</button>
                        <button className="w-10 h-10 border border-gray-100 rounded-lg text-sm font-medium hover:bg-gray-50">3</button>
                        <button className="px-4 py-2 text-sm font-bold text-gray-800 hover:text-blue-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TabButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3",
                active
                    ? "bg-blue-500 text-white shadow-md shadow-blue-200 lg:scale-105"
                    : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-500"
            )}
        >
            <span>{label}</span>
            <span className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-black",
                active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
            )}>
                {count}
            </span>
        </button>
    )
}
