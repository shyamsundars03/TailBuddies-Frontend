"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, Search, Filter, Calendar as CalendarIcon, Eye, Trash2, LayoutGrid, List, ChevronDown, Loader2, MessageSquare } from "lucide-react"
import { appointmentApi } from "@/lib/api/appointment.api"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"

export default function AppointmentsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialTab = searchParams.get('tab') || "Upcoming"
    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")

    const [activeTab, setActiveTab] = useState(initialTab)
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [allStats, setAllStats] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const entriesPerPage = 10

    const fetchStats = useCallback(async () => {
        const response = await appointmentApi.getDoctorStats()
        if (response.success) {
            setAllStats(response.stats)
        }
    }, [])

    const fetchAppointmentsData = useCallback(async (page: number, search: string, tab: string) => {
        setIsLoading(true)
        let status = ""
        if (tab === "Upcoming") status = "confirmed" // Use confirmed status for upcoming
        else if (tab === "Cancelled") status = "cancelled"
        else if (tab === "Completed") status = "completed"
        else if (tab === "Requests") status = "cancel request"

        const response = await appointmentApi.getDoctorAppointments(status, page, entriesPerPage, search)
        if (response.success) {
            setAppointments(response.data || [])
            setTotalEntries(response.total || 0)
            setTotalPages(Math.ceil((response.total || 0) / entriesPerPage) || 1)
        }
        setIsLoading(false)
        fetchStats() 
    }, [entriesPerPage, fetchStats])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (activeTab && activeTab !== "Upcoming") params.set('tab', activeTab)
        
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    const handleStartNow = async (id: string) => {
        router.push(`/doctor/appointments/${id}`)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold font-inter text-[#002B49]">Appointments</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-black" 
                        />
                    </div>
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0">
                        <button className="p-2 bg-blue-600 text-white"><LayoutGrid size={18} /></button>
                        <button className="p-2 bg-white text-gray-400 hover:bg-gray-50"><List size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Tabs & Date Range */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50 rounded-xl w-fit">
                    {["Upcoming", "Requests", "Cancelled", "Completed"].map((tab) => {
                        let count = 0;
                        if (allStats) {
                            if (tab === "Upcoming") count = allStats.upcoming;
                            else if (tab === "Requests") count = allStats.requests;
                            else if (tab === "Cancelled") count = allStats.cancelled;
                            else if (tab === "Completed") count = allStats.completed;
                        }
                        
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeTab === tab 
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <span>{tab}</span>
                                {count > 0 && (
                                    <span className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black",
                                        activeTab === tab ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <CalendarIcon size={14} className="text-blue-600" />
                        <span>Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition">
                        <Filter size={14} className="text-blue-600" />
                        Filter By <ChevronDown size={12} />
                    </button>
                </div>
            </div>

            {/* Appointment List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md hover:border-blue-100">
                            <div className="flex flex-wrap lg:flex-nowrap lg:items-center gap-4 lg:gap-8">
                                {/* Patient Avatar & Name */}
                                <div className="flex items-center gap-4 min-w-[200px] flex-1 lg:flex-none">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                        <Image src={apt.petId?.picture || apt.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100&h=100"} alt={apt.petId?.name} width={56} height={56} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase">AptID: {apt.appointmentId || apt._id.slice(-8).toUpperCase()}</span>
                                            <span className={cn(
                                                "px-2 py-0.5 text-[8px] text-white font-black rounded-full uppercase tracking-tighter",
                                                apt.status === 'confirmed' ? "bg-emerald-500" :
                                                apt.status === 'booked' ? "bg-blue-500" :
                                                apt.status === 'cancel request' ? "bg-orange-500 animate-pulse" :
                                                apt.status === 'refund request' ? "bg-purple-500" :
                                                apt.status === 'cancelled' ? "bg-red-500" :
                                                "bg-gray-400"
                                            )}>
                                                {apt.status}
                                            </span>
                                        </div>
                                        <span className="text-base font-bold text-gray-900 truncate block leading-tight">{apt.petId?.name || "Unknown Pet"}</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase truncate">Owner: {apt.ownerId?.username || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <Clock size={14} className="text-blue-600 shrink-0" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                                                {new Date(apt.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[11px] font-black text-blue-950 uppercase tracking-widest leading-none">{apt.appointmentStartTime} - {apt.appointmentEndTime}</p>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{apt.serviceType}</p>
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 truncate text-gray-400">
                                            <span className="text-[10px]">📧</span>
                                            <span className="text-[11px] font-medium text-gray-600 truncate">{apt.ownerId?.email || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <span className="text-[10px]">📞</span>
                                            <span className="text-[11px] font-medium text-gray-600">{apt.ownerId?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 flex-wrap sm:flex-nowrap w-full lg:w-auto lg:pl-4">
                                    <Link href={`/doctor/appointments/${apt._id}`} className="flex-1 sm:flex-none flex items-center justify-center p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition border border-gray-100 shadow-sm" title="View Details">
                                        <Eye size={18} />
                                    </Link>
                                    <button className="flex-1 sm:flex-none flex items-center justify-center p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition border border-gray-100 shadow-sm" title="Message Owner">
                                        <MessageSquare size={18} />
                                    </button>
                                    {activeTab === "Upcoming" && (
                                        <button 
                                            onClick={() => handleStartNow(apt._id)}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95"
                                        >
                                            Start Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                        <CalendarIcon size={24} className="text-gray-200" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No {activeTab.toLowerCase()} appointments</p>
                </div>
            )}

            {/* Pagination Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalEntries={totalEntries}
                    entriesPerPage={entriesPerPage}
                />
            </div>
        </div>
    )
}
