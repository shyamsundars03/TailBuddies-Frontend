"use client"

import { ChevronDown } from "lucide-react"
import { DoctorFilters } from "@/components/owner/DoctorFilters"
import { DoctorCard } from "@/components/owner/DoctorCard"

import { useEffect, useCallback, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { Pagination } from "@/components/common/ui/Pagination"
import { SearchInput } from "@/components/common/ui/SearchInput"
import { useOwnerServices } from "@/lib/hooks/owner/useOwnerServices"
import { useDebounce } from "@/lib/hooks/useDebounce"
import type { DoctorFilters as DoctorFilterParams } from "@/lib/types/doctor/doctor.api.types"
import { getSpecialtyLabel } from "@/lib/utils/utils"

export default function DoctorServicesPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Initialize from URL
    const initialSearch = searchParams.get('search') || ''
    const initialPage = parseInt(searchParams.get('page') || '1')
    const initialSpecialty = searchParams.get('specialty') || ''
    const initialGender = searchParams.get('gender') || ''
    const initialExperience = searchParams.get('experienceYears') || ''
    const initialCity = searchParams.get('city') || ''
    const initialMinRating = searchParams.get('minRating') || ''
    const initialSortBy = searchParams.get('sortBy') || 'Price (Low to High)'

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const debouncedSearchTerm = useDebounce(searchTerm, 1000)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [sortBy, setSortBy] = useState(initialSortBy)

    const [filters, setFilters] = useState({
        specialty: initialSpecialty,
        gender: initialGender,
        experienceYears: initialExperience,
        city: initialCity,
        minRating: initialMinRating
    })

    const {
        doctors,
        specialties,
        totalPages,
        totalDoctors,
        // totalOwner,
        isLoading,
        getSpecialties,
        getDoctorsList,
    } = useOwnerServices()

    useEffect(() => {
        getSpecialties()
    }, [getSpecialties])

    const loadDoctors = useCallback(async (page: number, search: string, activeFilters: DoctorFilterParams, sort: string) => {
        console.log("🔍 Fetching doctors with:", { page, search, activeFilters, sort })
        await getDoctorsList(page, 9, search, true, undefined, activeFilters, sort)
    }, [getDoctorsList])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (filters.specialty) params.set('specialty', filters.specialty)
        if (filters.gender) params.set('gender', filters.gender)
        if (filters.experienceYears) params.set('experienceYears', filters.experienceYears)
        if (filters.city) params.set('city', filters.city)
        if (filters.minRating) params.set('minRating', filters.minRating)
        if (sortBy !== 'Price (Low to High)') params.set('sortBy', sortBy)

        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, filters, sortBy, pathname, router])

    // Restore "Old" logic: Trigger load on debounced search/filters/sortBy change
    useEffect(() => {
        setCurrentPage(1)
        loadDoctors(1, debouncedSearchTerm, filters, sortBy)
    }, [debouncedSearchTerm, filters, sortBy, loadDoctors])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        loadDoctors(page, debouncedSearchTerm, filters, sortBy)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        // currentPage reset is handled by the useEffect above
    }

    const clearFilters = () => {
        setFilters({ specialty: '', gender: '', experienceYears: '', city: '', minRating: '' })
        setSearchTerm('')
    }

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser")
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                const data = await res.json()
                const addr = data.address

                const city = addr.city || addr.town || addr.village || ""

                if (city) {
                    setFilters(prev => ({ ...prev, city }))
                    toast.success(`Location detected: ${city}`)
                } else {
                    toast.error("Could not determine your city")
                }
            } catch (err) {
                console.error("Error fetching location details:", err)
                toast.error("Failed to fetch location details")
            }
        }, (error) => {
            console.error("Geolocation error:", error)
            toast.error("Unable to retrieve your location")
        })
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

                <div className="relative group max-w-2xl flex items-center gap-2">
                    <SearchInput 
                        placeholder="Search for Specialities , Doctors , etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        containerClassName="flex-1"
                        className="py-3 shadow-md"
                    />
                    <button
                        onClick={() => loadDoctors(1, searchTerm, filters, sortBy)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-xs uppercase tracking-wider"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleGetLocation}
                        className="px-4 py-3 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        Near Me
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <DoctorFilters
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                        specialties={(specialties ?? []) as unknown as import("@/lib/types/admin/admin.types").Specialty[]}
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
                                    Results for &quot;<span className="text-blue-600 italic">{debouncedSearchTerm}</span>&quot;
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 group cursor-pointer text-blue-950 font-bold">
                            </div>

                            <div className="flex items-center gap-4 border-l border-gray-100 pl-4">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-transparent pr-8 text-xs font-bold text-blue-950 uppercase tracking-widest focus:outline-none cursor-pointer"
                                    >
                                        <option value="">Default</option>
                                        <option>Price (Low to High)</option>
                                        <option>Price (High to Low)</option>
                                        <option>Rating</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
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
                                    name={doctor.userId?.username || "N/A"}
                                    specialty={getSpecialtyLabel(doctor.profile?.specialtyId, doctor.profile?.designation || "Specialist")}
                                    rating={doctor.averageRating || 0}
                                    reviewsCount={doctor.reviewCount || 0}
                                    // ownerCount ={doctor.ownerCount ||0}
                                    location={doctor.clinicInfo?.address?.city || "N/A"}
                                    duration={`${doctor.appointmentDuration || 30} Min`}
                                    fee={String(doctor.profile?.consultationFees || 0)}
                                    image={doctor.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"}
                                    available={doctor.isActive ?? false}
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

