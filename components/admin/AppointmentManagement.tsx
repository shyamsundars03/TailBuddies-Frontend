"use client"

import React, { useState, useEffect } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { appointmentApi } from '@/lib/api/appointment.api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusTab, setStatusTab] = useState('All')
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const limit = 10
    const router = useRouter()

    const statuses = ['All', 'Booked', 'Confirmed', 'Completed', 'Cancelled', 'Payment Pending']

    const fetchAll = async (page: number, search: string, status: string) => {
        setIsLoading(true)
        const statusQuery = status === 'All' ? '' : status.toLowerCase()
        const response = await appointmentApi.getAll(page, limit, search, statusQuery)
        if (response.success) {
            setAppointments(response.data || [])
            setTotalEntries(response.total || 0)
            setTotalPages(Math.ceil((response.total || 0) / limit) || 1)
        } else {
            toast.error(response.error || "Failed to fetch all appointments")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAll(currentPage, searchTerm, statusTab)
        }, 500)
        return () => clearTimeout(timer)
    }, [currentPage, searchTerm, statusTab])

    const columns: Column<any>[] = [
        {
            header: "Doctor Name",
            accessor: (apt) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                        <img 
                            src={apt.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150"} 
                            alt="Doctor" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer truncate max-w-[120px]">
                            Dr. {apt.doctorId?.userId?.username || "Unknown"}
                        </span>
                        <span className="text-blue-500 font-bold text-[9px] uppercase tracking-tighter">AptID: {apt.appointmentId || apt._id.slice(-8).toUpperCase()}</span>
                    </div>
                </div>
            )
        },
        { 
            header: "Speciality", 
            accessor: (apt) => apt.doctorId?.profile?.designation || "Veterinary",
            className: "text-xs" 
        },
        {
            header: "Patient Name",
            accessor: (apt) => (
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer truncate max-w-[120px]">
                        {apt.petId?.name || "Unknown"}
                    </span>
                </div>
            )
        },
        {
            header: "Appointment Time",
            accessor: (apt) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 font-bold text-xs">
                        {new Date(apt.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-blue-500 text-[10px] font-bold">{apt.appointmentStartTime} - {apt.appointmentEndTime}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (apt) => (
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                    apt.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                    apt.status === 'booked' ? "bg-blue-100 text-blue-600" :
                    apt.status === 'cancelled' ? "bg-red-100 text-red-600" :
                    apt.status === 'completed' ? "bg-purple-100 text-purple-600" :
                    apt.status === 'payment pending' ? "bg-amber-100 text-amber-600" :
                    "bg-gray-100 text-gray-600"
                )}>
                    {apt.status}
                </span>
            )
        },
        { 
            header: "Amount", 
            accessor: (apt) => `₹${apt.doctorId?.profile?.consultationFees || 0}`, 
            className: "text-xs font-bold text-gray-700" 
        }
    ]

    return (
        <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            setStatusTab(status)
                            setCurrentPage(1)
                        }}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            statusTab === status 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                                : "bg-white text-gray-400 hover:text-blue-600 border border-gray-100"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                        Showing {appointments.length} of {totalEntries} Appointments
                    </p>
                    <SearchInput
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        containerClassName="w-72"
                    />
                </div>

                {isLoading && appointments.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Records...</p>
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={appointments}
                            keyExtractor={(apt) => apt._id}
                            onRowClick={(apt) => router.push(`/admin/appointmentManagement/${apt._id}`)}
                            className="border-0 shadow-none rounded-none"
                        />

                        <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalEntries={totalEntries}
                                entriesPerPage={limit}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
