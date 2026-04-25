"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Clock, Video, User, ChevronLeft, Loader2, CheckCircle2, XCircle, Info } from "lucide-react"
import { appointmentApi } from "@/lib/api/appointment.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"
import Swal from 'sweetalert2'

export default function RequestDetailPage() {
    const router = useRouter()
    const params = useParams()
    const [request, setRequest] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchRequest = async () => {
        if (!params?.id) return
        setIsLoading(true)
        const response = await appointmentApi.getAppointmentById(params.id as string)
        if (response.success) {
            setRequest(response.data)
        } else {
            toast.error(response.error || "Failed to fetch request details")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchRequest()
    }, [params?.id])

    const handleStatusUpdate = async (status: string) => {
        if (!request?._id) return;
        
        if (status === 'cancelled') {
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
                const response = await appointmentApi.updateStatus(request._id, status, reason)
                if (response.success) {
                    toast.success("Appointment rejected successfully")
                    router.push('/doctor/requests')
                } else {
                    toast.error(response.message || "Failed to reject appointment")
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
                const response = await appointmentApi.updateStatus(request._id, status)
                if (response.success) {
                    toast.success("Appointment accepted successfully")
                    router.push('/doctor/requests')
                } else {
                    toast.error(response.message || "Failed to accept appointment")
                }
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Request Details...</p>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Request not found</p>
                <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline text-sm">Go Back</button>
            </div>
        )
    }

    const owner = request.ownerId;
    const pet = request.petId;

    return (
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-inter text-gray-900">Request Details</h2>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                </div>

                {/* Request Summary Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm text-black">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                <Image 
                                    src={pet?.picture || pet?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=128&h=128"} 
                                    alt={pet?.name || "Pet"} 
                                    width={64} 
                                    height={64} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-blue-600 uppercase">AptID: {request.appointmentId || request._id.slice(-8).toUpperCase()}</span>
                                    {/* <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-black rounded-full uppercase tracking-tighter italic">New</span> */}
                                </div>
                                <span className="text-xl font-black block text-blue-950 uppercase">{pet?.name || "Unknown"}</span>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Clock size={16} className="text-blue-600" />
                                    <span className="text-xs font-bold uppercase ">
                                        {new Date(request.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        {" "}
                                        {request.appointmentStartTime}
                                    </span>
                                </div>
                                <p className="text-xs font-black text-blue-950 uppercase ">
                                    {request.serviceType} Consultation
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Mode</span>
                                <div className="flex items-center  text-blue-600">
                                    <User size={18} />
                                    <span className="text-xs font-black text-gray-700 uppercase">{request.mode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-10">
                            <button 
                                onClick={() => handleStatusUpdate('confirmed')}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm active:scale-95"
                            >
                                <CheckCircle2 size={16} /> Accept
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate('cancelled')}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-3 bg-red-50 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95"
                            >
                                <XCircle size={16} /> Reject
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-10">
                    {/* Owner Details */}
                    <div>
                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-tight mb-4">Pet Owner:</h3>
                        <div className="bg-gray-50/20 rounded-2xl border border-gray-100 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Name</span>
                                    <p className="text-xs font-black text-gray-800">{owner?.username}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                                    <p className="text-xs font-black text-gray-800">{owner?.email}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Phone</span>
                                    <p className="text-xs font-black text-gray-800">{owner?.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pet Details */}
                    <div>
                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-tight mb-4">Pet Information:</h3>
                        <div className="bg-gray-50/20 rounded-2xl border border-gray-100 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Species</span>
                                    <p className="text-xs font-black text-gray-800 uppercase">{pet?.type || pet?.species}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Breed</span>
                                    <p className="text-xs font-black text-gray-800">{pet?.breed}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Gender / Age</span>
                                    <p className="text-xs font-black text-gray-800 capitalize">{pet?.gender} / {pet?.age} Years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Problem & Symptoms */}
                    <div className="pt-4">
                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Info size={16} className="text-blue-600" /> Problem & Symptoms
                        </h3>
                        <div className="bg-gray-50/30 rounded-2xl border border-gray-100 p-8 space-y-10">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1 rounded-full mb-4 inline-block">Problem Description</span>
                                <p className="text-sm font-medium text-gray-800 leading-relaxed max-w-3xl pl-1">{request.problemDescription}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1 rounded-full mb-4 inline-block">Symptoms Reported</span>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {request.symptoms?.map((symptom: string) => (
                                        <span key={symptom} className="px-5 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-wider border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors">
                                            {symptom}
                                        </span>
                                    ))}
                                    {(!request.symptoms || request.symptoms.length === 0) && (
                                        <p className="text-xs font-bold text-gray-400 italic">No specific symptoms mentioned</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
