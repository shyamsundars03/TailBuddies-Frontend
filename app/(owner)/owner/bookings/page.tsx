"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search, Calendar, Filter, List, Grid, Eye, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"
import { appointmentApi } from "@/lib/api/appointment.api"
import { toast } from "sonner"

import { Pagination } from "../../../../components/common/ui/Pagination";

export default function MyBookingsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialStatus = searchParams.get('status') || "Booked"
    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")

    const [activeTab, setActiveTab] = useState(initialStatus)
    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const entriesPerPage = 10

    const fetchAppointmentsData = useCallback(async (page: number, search: string, status: string) => {
        setIsLoading(true)
        const response = await appointmentApi.getOwnerAppointments(page, entriesPerPage, search, status)
        if (response.success) {
            setAppointments(response.data || [])
            setTotalEntries(response.total || 0)
            setTotalPages(Math.ceil((response.total || 0) / entriesPerPage) || 1)
        } else {
            // toast.error(response.error || "Failed to fetch bookings")
        }
        setIsLoading(false)
    }, [entriesPerPage])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (activeTab && activeTab !== "Booked") params.set('status', activeTab)
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, activeTab, pathname, router])

    // Load data when state changes
    useEffect(() => {
        fetchAppointmentsData(currentPage, debouncedSearchTerm, activeTab)
    }, [currentPage, debouncedSearchTerm, activeTab, fetchAppointmentsData])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleTabChange = (status: string) => {
        setActiveTab(status)
        setCurrentPage(1)
    }

    const displayAppointments = appointments

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
                    </div>
                    
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <div className="flex gap-2">
                        <TabButton 
                            label="Booked" 
                            count={appointments.filter(a => a.status === 'Booked').length} 
                            active={activeTab === "Booked"} 
                            onClick={() => handleTabChange("Booked")} 
                        />
                        <TabButton 
                            label="Confirmed" 
                            count={appointments.filter(a => a.status === 'Confirmed').length} 
                            active={activeTab === "Confirmed"} 
                            onClick={() => handleTabChange("Confirmed")} 
                        />
                        <TabButton 
                            label="Cancelled" 
                            count={appointments.filter(a => a.status === 'Cancelled').length} 
                            active={activeTab === "Cancelled"} 
                            onClick={() => handleTabChange("Cancelled")} 
                        />
                        <TabButton 
                            label="Completed" 
                            count={appointments.filter(a => a.status === 'Completed').length} 
                            active={activeTab === "Completed"} 
                            onClick={() => handleTabChange("Completed")} 
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Your Bookings...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayAppointments.length > 0 ? (
                            displayAppointments.map((booking) => (
                                <div key={booking._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-gray-50 shadow-sm relative">
                                                <Image
                                                    src={booking.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"}
                                                    alt="Doctor"
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">AptID: {booking.appointmentId || booking._id.slice(-8).toUpperCase()}</span>
                                                    
                                                    <span className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                                        booking.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" :
                                                        booking.status === 'Booked' ? "bg-blue-100 text-blue-600" :
                                                        booking.status === 'Cancelled' ? "bg-red-100 text-red-600" :
                                                        "bg-gray-100 text-gray-600"
                                                    )}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-800 text-lg">Dr. {booking.doctorId?.userId?.userName}</h3>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={18} className="text-blue-500" />
                                                <span className="text-sm font-semibold">
                                                    {new Date(booking.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    {" "}
                                                    {booking.appointmentStartTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-blue-950/70">{booking.serviceType}</span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <span className="text-xs font-bold text-blue-950/70 capitalize">{booking.mode}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-400 mb-1">Pet Name</p>
                                            <p className="font-bold text-gray-800">{booking.petId?.name}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/owner/bookings/${booking._id}`}
                                                className="px-6 py-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2"
                                            >
                                                <Eye size={16} />
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No bookings found for this category</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Section */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={totalEntries}
                        entriesPerPage={entriesPerPage}
                    />
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
