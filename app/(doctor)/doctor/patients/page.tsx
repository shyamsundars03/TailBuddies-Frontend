"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Calendar, MapPin, ChevronDown, Loader2 } from "lucide-react"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { appointmentApi } from "@/lib/api/appointment.api"

// dummy data removed

export default function PatientsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")

    const [patients, setPatients] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const entriesPerPage = 9

    const fetchPatients = useCallback(async (page: number, search: string) => {
        setIsLoading(true)
        const response = await appointmentApi.getDoctorPatients(page, entriesPerPage, search)
        if (response.success) {
            setPatients(response.data || [])
            setTotalEntries(response.total || 0)
            setTotalPages(Math.ceil((response.total || 0) / entriesPerPage) || 1)
        }
        setIsLoading(false)
    }, [entriesPerPage])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, pathname, router])

    // Load data
    useEffect(() => {
        fetchPatients(currentPage, debouncedSearchTerm)
    }, [currentPage, debouncedSearchTerm, fetchPatients])

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

    return (
        <div className="w-full">
            {/* Header Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-inter text-gray-900">My Patients</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search patients..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-black" 
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-xl invisible">
                        {/* Tab filtering can be added here if needed */}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600">
                            <Calendar size={16} className="text-blue-600" />
                            <span className="text-xs">09 December 25 - 09 December 25</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium group text-gray-600">
                            <Filter size={16} className="text-blue-600" />
                            <span className="text-xs group-hover:text-blue-600 transition">Filter By</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading patients...</p>
                </div>
            ) : patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <div key={patient.id} className="group bg-white rounded-3xl border border-gray-100 p-6 transition-all hover:shadow-xl hover:border-blue-100 flex flex-col">
                            <div className="flex items-center gap-4 mb-6 text-black">
                                <Link href={`/doctor/patients/${patient.id}`} className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm transition-transform hover:scale-105 block shrink-0">
                                    <Image 
                                        src={patient.picture || "/placeholder.svg"} 
                                        alt={patient.name} 
                                        width={80} 
                                        height={80} 
                                        className="w-full h-full object-cover" 
                                    />
                                </Link>
                                <div className="space-y-1 min-w-0">
                                    <span className="text-xs font-bold text-blue-600">ID: {patient.id?.substring(0, 8)}</span>
                                    <Link href={`/doctor/patients/${patient.id}`} className="text-lg font-bold hover:text-blue-600 transition truncate block leading-tight">
                                        {patient.name}
                                    </Link>
                                    <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-500">
                                        <span className="truncate">{patient.species} - {patient.breed}</span>
                                        <span className="text-blue-600">{patient.ownerName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 rounded-2xl p-4 space-y-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Calendar size={16} className="text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">
                                        Last: {new Date(patient.lastAppointmentDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <MapPin size={16} className="text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 truncate">{patient.ownerEmail}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium italic">No patients found</p>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalEntries={totalEntries}
                    entriesPerPage={entriesPerPage}
                    className="py-6 px-8"
                />
            </div>
        </div>
    )
}
