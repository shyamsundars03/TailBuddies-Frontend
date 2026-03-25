"use client"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, Video, User, Info, ChevronDown, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { appointmentApi } from "@/lib/api/appointment.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"
import Swal from 'sweetalert2'

export default function RequestsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialPage = parseInt(searchParams.get('page') || "1")

    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const entriesPerPage = 10

    const fetchRequestsData = useCallback(async (page: number) => {
        setIsLoading(true)
        const response = await appointmentApi.getDoctorAppointments('Booked', page, entriesPerPage)
        if (response.success) {
            setRequests(response.data || [])
            setTotalEntries(response.total || 0)
            setTotalPages(Math.ceil((response.total || 0) / entriesPerPage) || 1)
        } else {
            // toast.error(response.error || "Failed to fetch requests")
        }
        setIsLoading(false)
    }, [entriesPerPage])

    // Update URL when page changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (currentPage > 1) params.set('page', currentPage.toString())
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [currentPage, pathname, router])

    // Load data when page changes
    useEffect(() => {
        fetchRequestsData(currentPage)
    }, [currentPage, fetchRequestsData])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        if (status === 'Cancelled') {
            const { value: reason } = await Swal.fire({
                title: 'Reject Appointment',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Enter reason here...',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Reject Appointment',
                inputValidator: (value) => {
                    if (!value) return 'Please provide a reason for rejection'
                }
            })

            if (reason) {
                const response = await appointmentApi.updateStatus(id, status, reason)
                if (response.success) {
                    toast.success("Appointment rejected successfully")
                    fetchRequestsData(currentPage)
                } else {
                    toast.error(response.error || "Failed to reject appointment")
                }
            }
        } else {
            const result = await Swal.fire({
                title: 'Accept Appointment?',
                text: "Are you sure you want to accept this appointment?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, Accept'
            })

            if (result.isConfirmed) {
                const response = await appointmentApi.updateStatus(id, status)
                if (response.success) {
                    toast.success("Appointment accepted successfully")
                    fetchRequestsData(currentPage)
                } else {
                    toast.error(response.error || "Failed to accept appointment")
                }
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Requests...</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-inter">Requests</h2>
                <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition">
                        Newest First <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request._id} className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md hover:border-blue-100">
                            <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-6">
                                {/* Patient Avatar & Name */}
                                <div className="flex items-center gap-4 min-w-[200px] flex-1 lg:flex-none">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                        <Image 
                                            src={request.petId?.picture || request.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100&h=100"} 
                                            alt={request.petId?.name || "Pet"} 
                                            width={56} 
                                            height={56} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase">AptID: {request.appointmentId || request._id.slice(-8).toUpperCase()}</span>
                                            {/* <span className="px-2 py-0.5 bg-blue-600 text-[8px] text-white font-black rounded-full uppercase tracking-tighter">New</span> */}
                                        </div>
                                        <Link href={`/doctor/requests/${request._id}`} className="text-base font-bold text-gray-900 hover:text-blue-600 transition truncate block leading-tight">
                                            {request.petId?.name || "Unknown Pet"}
                                        </Link>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase truncate">Owner: {request.ownerId?.userName || "N/A"}</p>
                                    </div>
                                </div>

                                 {/* Appointment Info */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-4 min-w-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Clock size={14} className="text-blue-600 shrink-0" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                                                {new Date(request.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-black text-blue-950 uppercase tracking-widest">{request.appointmentStartTime} - {request.appointmentEndTime}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100">
                                    <button 
                                        onClick={() => handleStatusUpdate(request._id, 'Confirmed')}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                                    >
                                        <CheckCircle2 size={14} /> Accept
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(request._id, 'Cancelled')}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-red-50 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <User size={24} className="text-gray-300" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">No pending requests found</p>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalEntries={totalEntries}
                entriesPerPage={entriesPerPage}
                className="mt-8 pt-8 border-t border-gray-100"
            />
        </div>
    )
}
