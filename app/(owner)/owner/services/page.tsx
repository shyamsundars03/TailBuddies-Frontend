"use client"

import { Search,  Grid, List, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DoctorFilters } from "@/components/owner/DoctorFilters"
import { DoctorCard } from "@/components/owner/DoctorCard"
import { cn } from "@/lib/utils/utils"

import { useEffect, useCallback, useState, useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { doctorApi } from "@/lib/api/doctor/doctor.api"
import { toast } from "sonner"
import { Pagination } from "@/components/common/ui/Pagination"

export default function DoctorServicesPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [doctors, setDoctors] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState('Price (Low to High)')
    
    // Initialize from URL
    const initialSearch = searchParams.get('search') || ''
    const initialPage = parseInt(searchParams.get('page') || '1')
    const initialSpecialty = searchParams.get('specialty') || ''
    const initialGender = searchParams.get('gender') || ''
    const initialExperience = searchParams.get('experienceYears') || ''

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(1)
    const [totalDoctors, setTotalDoctors] = useState(0)
    
    const [filters, setFilters] = useState({
        specialty: initialSpecialty,
        gender: initialGender,
        experienceYears: initialExperience
    })

    const [specialties, setSpecialties] = useState<any[]>([])

    const loadSpecialties = async () => {
        const response = await doctorApi.getSpecialties()
        if (response.success) {
            setSpecialties(response.data)
        }
    }

    useEffect(() => {
        loadSpecialties()
    }, [])

    const loadDoctors = useCallback(async (page: number, search: string, activeFilters: any) => {
        setIsLoading(true)
        const response = await doctorApi.getAllDoctors(page, 9, search, true, undefined, activeFilters)
        if (response.success) {
            setDoctors(response.data || [])
            setTotalPages(Math.ceil((response.total || 0) / (response.limit || 9)))
            setTotalDoctors(response.total || 0)
        } else {
            // toast.error(response.error || "Failed to load doctors")
        }
        setIsLoading(false)
    }, [])

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (filters.specialty) params.set('specialty', filters.specialty)
        if (filters.gender) params.set('gender', filters.gender)
        if (filters.experienceYears) params.set('experienceYears', filters.experienceYears)
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, filters, pathname, router])

    // Restore "Old" logic: Trigger load on debounced search/filters change
    useEffect(() => {
        setCurrentPage(1)
        loadDoctors(1, debouncedSearchTerm, filters)
    }, [debouncedSearchTerm, filters, loadDoctors])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        loadDoctors(page, debouncedSearchTerm, filters)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        // currentPage reset is handled by the useEffect above
    }

    const clearFilters = () => {
        setFilters({ specialty: '', gender: '', experienceYears: '' })
        setSearchTerm('')
        setDebouncedSearchTerm('')
    }

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Search Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-gray-900">Find Doctor</h1>
                        <p className="text-gray-500 text-sm">Discover the best doctors specialized in pet care</p>
                    </div>
                </div>

                <div className="relative group max-w-2xl">
                    <div className="bg-white rounded-lg shadow-md p-1.5 flex items-center border border-gray-100 group-focus-within:border-blue-500 transition-all duration-300">
                        <div className="flex-1 flex items-center px-4">
                            <Search className="text-blue-500" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for Specialities , Doctors , etc..."
                                className="w-full px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none bg-transparent"
                            />
                        </div>
                        <button 
                            onClick={() => loadDoctors(1, searchTerm, filters)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-xs uppercase tracking-wider"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <DoctorFilters 
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                        specialties={specialties}
                    />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Control Bar */}
                    <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Showing {Math.min((currentPage - 1) * 9 + 1, totalDoctors)} to {Math.min(currentPage * 9, totalDoctors)} of
                                </span>
                                <span className="text-sm font-bold text-blue-900">{totalDoctors} Doctors For You</span>
                            </div>
                            {debouncedSearchTerm && (
                                <p className="text-xs font-medium text-gray-400">
                                    Results for "<span className="text-blue-600 italic">{debouncedSearchTerm}</span>"
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                {/* <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</span> */}
                                {/* <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" /> */}
                            </div>

                            <div className="flex items-center gap-4 border-l border-gray-100 pl-4">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-transparent pr-8 text-xs font-bold text-blue-950 uppercase tracking-widest focus:outline-none cursor-pointer"
                                    >
                                        <option>Price (Low to High)</option>
                                        <option>Price (High to Low)</option>
                                        <option>Rating</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                {/* <div className="bg-gray-50 p-1 rounded-lg flex border border-gray-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "p-1.5 rounded transition-all duration-300",
                                            viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "p-1.5 rounded transition-all duration-300",
                                            viewMode === 'list' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <List size={16} />
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Doctor Grid */}
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Searching for best doctors...</div>
                    ) : doctors.length === 0 ? (
                        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-bold uppercase tracking-widest mb-4">No doctors found matching your criteria</p>
                            <button onClick={clearFilters} className="text-blue-600 font-black text-xs uppercase hover:underline">Clear all filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {doctors.map(doctor => (
                                <DoctorCard 
                                    key={doctor._id} 
                                    id={doctor._id}
                                    name={doctor.userId?.userName || "N/A"}
                                    specialty={doctor.profile?.specialtyId?.name || doctor.profile?.designation || "Specialist"}
                                    rating={4.8} // Placeholder for now
                                    reviewsCount={doctor.totalAppointments || 0}
                                    location={doctor.clinicInfo?.address?.city || "N/A"}
                                    duration={`${doctor.appointmentDuration || 30} Min`}
                                    fee={String(doctor.profile?.consultationFees || 0)}
                                    image={doctor.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"}
                                    available={doctor.isActive}
                                    isVerified={doctor.isVerified}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={totalDoctors}
                        entriesPerPage={9}
                    />
                </div>
            </div>
        </div>
    )
}
