"use client"

import React, { useState, useEffect } from 'react'

import { Appointment } from '@/lib/types/admin/admin.types'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { adminAppointmentApi } from '@/lib/api/admin'
import { toast } from 'sonner'
// import { Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useCallback } from 'react'

export function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusTab, setStatusTab] = useState('All')
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const limit = 10
    const router = useRouter()

    const statuses = ['All', 'Booked', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled', 'Payment Pending']

    const debouncedSearch = useDebounce(searchTerm, 1000)

    const fetchAll = useCallback(async (page: number, search: string, status: string) => {
        setIsLoading(true)
        try {
            const statusQuery = status === 'All' ? '' : status.toLowerCase()
            const response = await adminAppointmentApi.getAllAppointments({ page, limit, search, status: statusQuery })
            if (response.success && response.data) {
                setAppointments(Array.isArray(response.data.items) ? response.data.items : [])
                setTotalEntries(response.data.total || 0)
                setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1)
            } else {
                toast.error(response.message || "Failed to fetch all appointments")
            }
        } catch (error) {
            console.error("Error fetching appointments:", error)
            toast.error("An error occurred while fetching appointments")
        } finally {
            setIsLoading(false)
        }
    }, [limit])

    useEffect(() => {
        fetchAll(currentPage, debouncedSearch, statusTab)
    }, [currentPage, debouncedSearch, statusTab, fetchAll])

    const columns: Column<Appointment>[] = [
        { 
            header: "Practitioner", 
            accessor: (apt) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                        <Image
                            src={apt.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150"}
                            alt="Doctor"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-blue-600 truncate uppercase tracking-tight">Dr. {apt.doctorId?.userId?.username || "Unknown"}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest truncate">{apt.doctorId?.profile?.designation || "Veterinary"}</span>
                    </div>
                </div>
            )
        },
        { 
            header: "Patient / Owner", 
            accessor: (apt) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 tracking-tight">{apt.petId?.name || "Unknown"}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Owner: {apt.ownerId?.username || "N/A"}</span>
                </div>
            )
        },
        { 
            header: "Temporal Slot", 
            accessor: (apt) => (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-bold tracking-tight">
                        {new Date(apt.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">
                        {apt.appointmentStartTime} - {apt.appointmentEndTime}
                    </span>
                </div>
            )
        },
        { 
            header: "Billing", 
            accessor: (apt) => (
                <span className="text-sm font-black text-gray-900">₹{apt.totalAmount?.toLocaleString('en-IN') || 0}</span>
            )
        },
        { 
            header: "Lifecycle", 
            accessor: (apt) => (
                <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm inline-block",
                    apt.status?.toLowerCase() === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        apt.status?.toLowerCase() === 'cancelled' ? "bg-rose-50 text-rose-600 border-rose-100" :
                            apt.status?.toLowerCase() === 'completed' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                    {apt.status}
                </span>
            )
        }
    ]

    return (
        <div className="font-inter text-black">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Appointments</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">List of Appointments</span>
                </div>
            </div>

            {/* Tabs & Search Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusTab(status)
                                    setCurrentPage(1)
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                                    statusTab === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <SearchInput
                        placeholder="Search by ID, Pet or Owner..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full md:w-80"
                    />
                </div>

                <DataTable 
                    columns={columns}
                    data={appointments}
                    isLoading={isLoading}
                    keyExtractor={(apt) => apt._id}
                    onRowClick={(apt) => router.push(`/admin/appointmentManagement/${apt._id}`)}
                    emptyMessage="No Registry Found"
                />

                <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalEntries={totalEntries}
                        entriesPerPage={limit}
                    />
                </div>
            </div>
        </div>
    )
}
