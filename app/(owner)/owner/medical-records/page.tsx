"use client"
import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Calendar, Grid, List, Eye, Download, ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils/utils"
import { appointmentApi } from "@/lib/api/appointment.api"
import { userPetApi } from "@/lib/api/user/pet.api"
import { Pagination } from "@/components/common/ui/Pagination"

export default function MedicalRecordsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")
    const initialPet = searchParams.get('pet') || "All Pets"
    const initialTimeframe = searchParams.get('timeframe') || "Lifetime"

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [selectedPet, setSelectedPet] = useState(initialPet)
    const [selectedTimeframe, setSelectedTimeframe] = useState(initialTimeframe)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [isLoading, setIsLoading] = useState(false)
    const [records, setRecords] = useState<any[]>([]) 
    const [pets, setPets] = useState<any[]>([])
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const entriesPerPage = 3

    const fetchPets = useCallback(async () => {
        const response = await userPetApi.getOwnerPets(1, 100)
        if (response.success) {
            setPets(response.data?.pets || response.data || [])
        }
    }, [])

    const fetchRecords = useCallback(async (page: number, search: string, pet: string, timeframe: string) => {
        setIsLoading(true)
        const response = await appointmentApi.getOwnerAppointments(page, entriesPerPage, search, 'completed', timeframe)
        
        if (response.success) {
            let data = response.data || []
            
            // Client-side pet filter if needed
            if (pet !== "All Pets") {
                data = data.filter((appt: any) => appt.petId?.name === pet)
            }

            const formattedRecords = data.map((appt: any) => ({
                id: appt._id,
                petName: appt.petId?.name || "Unknown",
                species: appt.petId?.species || "Unknown",
                breed: appt.petId?.breed || "",
                date: `${new Date(appt.appointmentDate).toLocaleDateString()} ${appt.appointmentStartTime}`,
                type: appt.serviceType,
                mode: appt.mode === 'online' ? 'Video Call' : 'Offline Visit',
                appointmentId: `#${appt.appointmentId || appt._id.slice(-8).toUpperCase()}`,
                doctorName: appt.doctorId?.userId?.username || "Unknown",
                clinicalFindings: appt.prescriptionId?.clinicalFindings || "Not available",
                diagnosis: appt.prescriptionId?.diagnosis || "Not available",
                vetNotes: appt.prescriptionId?.vetNotes || "Not available",
                recommendedTests: appt.prescriptionId?.recommendedTests || "None",
                petImage: appt.petId?.picture || "/placeholder-pet.png"
            }))
            
            setRecords(formattedRecords)
            setTotalEntries(response.total || formattedRecords.length)
            setTotalPages(Math.ceil((response.total || formattedRecords.length) / entriesPerPage) || 1)
        }
        setIsLoading(false)
    }, [entriesPerPage])

    useEffect(() => {
        fetchPets()
    }, [fetchPets])

    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (selectedPet !== "All Pets") params.set('pet', selectedPet)
        if (selectedTimeframe !== "Lifetime") params.set('timeframe', selectedTimeframe)
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, selectedPet, pathname, router])

    useEffect(() => {
        fetchRecords(currentPage, debouncedSearchTerm, selectedPet, selectedTimeframe)
    }, [currentPage, debouncedSearchTerm, selectedPet, selectedTimeframe, fetchRecords])

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

    return (
        <div className="space-y-6 min-h-screen pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#002B49] mb-1">Medical Records</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">Medical Records</span>
                    </nav>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Filter Controls */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-[#002B49]">Choose Your Pet</span>
                        <div className="relative">
                            <select
                                value={selectedPet}
                                onChange={(e) => setSelectedPet(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[160px] text-gray-700"
                            >
                                <option>All Pets</option>
                                {pets.map(p => (
                                    <option key={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:text-blue-600 hover:border-blue-100 transition flex items-center gap-2 shadow-sm pointer-events-none">
                            Records
                            <span className="px-1.5 py-0.5 bg-blue-50 text-[10px] text-blue-600 rounded-md font-black italic">{totalEntries}</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-500 shadow-sm">
                            <Calendar size={14} className="text-blue-600" />
                            <span>Lifetime Records</span>
                        </div> */}
                        <div className="relative group/filter">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-500 hover:bg-gray-50 transition shadow-sm uppercase tracking-widest">
                                <Filter size={14} className="text-blue-600" />
                                {selectedTimeframe === 'Lifetime' ? 'Filter By' : selectedTimeframe} <ChevronDown size={12} className={cn("transition-transform", "group-hover/filter:rotate-180")} />
                            </button>
                            
                            {/* Filter Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-950/5 opacity-0 invisible group-hover/filter:opacity-100 group-hover/filter:visible transition-all z-50 overflow-hidden">
                                {['Lifetime', 'Today', 'This Week', 'This Month'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            setSelectedTimeframe(time)
                                            setCurrentPage(1)
                                        }}
                                        className={cn(
                                            "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                                            selectedTimeframe === time 
                                                ? "bg-blue-600 text-white" 
                                                : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <button className="p-2.5 bg-blue-600 text-white"><List size={18} /></button>
                            <button className="p-2.5 bg-white text-gray-400 hover:bg-gray-50"><Grid size={18} /></button>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* List Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Fetching Records...</p>
                </div>
            ) : records.length > 0 ? (
                <div className="space-y-6">
                    {records.map((record) => (
                        <div key={record.id} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            {/* Blue Accent Strip */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-100 group-hover:bg-blue-600 transition-colors" />
                            
                            <div className="flex flex-col gap-8">
                                {/* Record Header Row */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-gray-50 shadow-sm shrink-0">
                                            <Image 
                                                src={record.petImage} 
                                                alt={record.petName} 
                                                width={64} 
                                                height={64} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-[#002B49] uppercase tracking-tight">{record.petName}</h3>
                                                <span className="text-xs font-bold text-gray-400 italic">({record.species})</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Calendar size={12} /> {record.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">{record.type}</span>
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">{record.mode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">{record.appointmentId}</span>
                                        <span className="text-base font-bold text-[#002B49]">Dr {record.doctorName}</span>
                                    </div>
                                </div>

                                {/* Report Content Area */}
                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-[#002B49] border-b border-gray-100 pb-2 inline-block">Report</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-50/50">
                                            <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest mb-1.5">Clinical Findings</p>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{record.clinicalFindings}</p>
                                        </div>
                                        <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-50/50">
                                            <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest mb-1.5">Diagnosis</p>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{record.diagnosis}</p>
                                        </div>
                                        <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-50/50">
                                            <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest mb-1.5">Vet Notes</p>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{record.vetNotes}</p>
                                        </div>
                                        {/* <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-50/50">
                                            <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest mb-1.5">Recommended Tests</p>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{record.recommendedTests}</p>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-dashed border-gray-100">
                                    <Link 
                                        href={`/owner/medical-records/${record.id}`}
                                        className="px-8 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition shadow-sm active:scale-95 flex items-center gap-2"
                                    >
                                        <Eye size={16} /> View
                                    </Link>
                                    <button className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl text-xs font-black uppercase tracking-widest transition shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2">
                                        <Download size={16} /> Download Summary
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No medical records found</p>
                </div>
            )}

            {/* Pagination Feedback */}
            <div className="mt-8">
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
