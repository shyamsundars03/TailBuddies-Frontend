"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ChevronLeft, Download, Star, Clock } from 'lucide-react'
import { appointmentApi } from '@/lib/api/appointment.api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/utils'
import Image from 'next/image'

export function SingleAppointmentView({ id }: { id: string }) {
    const router = useRouter()
    const [appointment, setAppointment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!id) return
            setIsLoading(true)
            const response = await appointmentApi.getAppointmentById(id)
            if (response.success) {
                setAppointment(response.data)
            } else {
                toast.error(response.error || "Failed to fetch appointment details")
            }
            setIsLoading(false)
        }
        fetchAppointment()
    }, [id])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Appointment Details...</p>
            </div>
        )
    }

    if (!appointment) {
        return (
            <div className="text-center py-40 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Appointment not found</p>
                <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline text-sm uppercase">Go Back</button>
            </div>
        )
    }

    const doctorUser = appointment.doctorId?.userId;
    const pet = appointment.petId;
    const owner = appointment.ownerId;

    return (
        <div className="bg-gray-50/50 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-blue-950">Appointments</h1>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/appointmentManagement')}>Appointments</span>
                            <span>/</span>
                            <span className="text-gray-400 uppercase">AptID: {appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-8 py-2 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* Status Header */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                <Image 
                                    src={doctorUser?.profilePic || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150&h=150"} 
                                    alt="Doctor" 
                                    width={48} 
                                    height={48} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-0.5">AptID: {appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                                <p className="text-gray-900 font-black text-sm uppercase">Dr. {doctorUser?.username}</p>
                            </div>
                            <div className="ml-8 flex items-center gap-3">
                                <span className="text-blue-950 font-black text-xs uppercase">Status:</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                                    appointment.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" :
                                    appointment.status === 'Booked' ? "bg-blue-100 text-blue-600" :
                                    appointment.status === 'Cancelled' ? "bg-red-100 text-red-600" :
                                    "bg-gray-100 text-gray-600"
                                )}>
                                    {appointment.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={cn(
                                "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                                appointment.status === 'Completed' ? "bg-emerald-500 text-white" : "bg-yellow-400 text-gray-900"
                            )}>
                                {appointment.status === 'Completed' ? "Paid" : "Pay on Consultation"}
                            </span>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {/* Pet Info */}
                        <SectionLayout title="Pet Details">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <DataField label="Pet Name" value={pet?.name} />
                                <DataField label="Species" value={pet?.type || pet?.species} />
                                <DataField label="Breed" value={pet?.breed} />
                            </div>
                        </SectionLayout>

                        {/* Owner Info */}
                        <SectionLayout title="Owner Details">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <DataField label="Owner Name" value={owner?.username} />
                                <DataField label="Email" value={owner?.email} />
                                <DataField label="Phone" value={owner?.phone} />
                            </div>
                        </SectionLayout>

                        {/* Doctor Info */}
                        <SectionLayout title="Doctor Details">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <DataField label="Doctor Name" value={`Dr. ${doctorUser?.username}`} />
                                    <DataField label="Specialization" value={appointment.doctorId?.profile?.designation || "Veterinary"} />
                                    <DataField label="Experience" value={`${appointment.doctorId?.profile?.experienceYears || 0} years`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <DataField label="Consultation Fee" value={`₹${appointment.doctorId?.profile?.consultationFees || 0}`} />
                                    <DataField label="Service Type" value={appointment.serviceType} />
                                    <DataField label="Mode" value={appointment.mode} capitalize />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <DataField label="Date" value={new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                                    <DataField label="Time" value={`${appointment.appointmentStartTime} - ${appointment.appointmentEndTime}`} />
                                </div>
                            </div>
                        </SectionLayout>

                        {/* Problem & Symptoms */}
                        <SectionLayout title="Problem & Symptoms">
                            <div className="space-y-6">
                                <DataField label="Problem Description" value={appointment.problemDescription} fullWidth />
                                <DataField label="Symptoms Selected" value={appointment.symptoms?.join(", ")} />
                            </div>
                        </SectionLayout>

                        {/* Timeline */}
                        <SectionLayout title="Appointment Timeline">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                                <DataField label="Booked At" value={new Date(appointment.createdAt).toLocaleString()} />
                                <DataField label="Status" value={appointment.status} />
                                <DataField label="Delay Status" value={appointment.delayStatus || "None"} />
                                {appointment.checkIn?.vetCheckInTime && <DataField label="Check-In" value={new Date(appointment.checkIn.vetCheckInTime).toLocaleTimeString()} />}
                                {appointment.checkOut?.vetCheckOutTime && <DataField label="Check-Out" value={new Date(appointment.checkOut.vetCheckOutTime).toLocaleTimeString()} />}
                            </div>
                        </SectionLayout>

                        {/* Report & Prescription (Optional) */}
                        {appointment.status === 'Completed' && (
                            <>
                                <SectionLayout title="Clinical Report">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                                        <DataField label="Clinical Findings" value={appointment.clinicalFindings || "Not provided"} />
                                        <DataField label="Diagnosis" value={appointment.diagnosis || "Not provided"} />
                                        <DataField label="Vet Notes" value={appointment.notes || "Not provided"} />
                                    </div>
                                </SectionLayout>

                                {appointment.prescription && appointment.prescription.length > 0 && (
                                    <SectionLayout title="Prescription">
                                        <div className="overflow-hidden bg-white">
                                            <div className="grid grid-cols-4 py-2 border-b border-gray-50 mb-4 px-2">
                                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Medicine</span>
                                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Dosage</span>
                                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Frequency</span>
                                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Duration</span>
                                            </div>
                                            <div className="space-y-4">
                                                {appointment.prescription.map((item: any, idx: number) => (
                                                    <div key={idx} className="grid grid-cols-4 px-2">
                                                        <span className="text-gray-900 font-black text-xs">{item.medicine}</span>
                                                        <span className="text-gray-500 font-medium text-xs">{item.dosage}</span>
                                                        <span className="text-gray-500 font-medium text-xs">{item.frequency}</span>
                                                        <span className="text-gray-900 font-black text-xs">{item.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </SectionLayout>
                                )}
                            </>
                        )}
                        
                        {/* Cancellation Reason */}
                        {appointment.status === 'Cancelled' && appointment.cancellation?.cancelReason && (
                            <SectionLayout title="Cancellation Information">
                                <DataField label="Reason for rejection" value={appointment.cancellation.cancelReason} fullWidth />
                            </SectionLayout>
                        )}

                        {/* Payment */}
                        <SectionLayout title="Payment Information">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <DataField label="Consultation Fee" value={`₹${appointment.doctorId?.profile?.consultationFees || 0}`} />
                                <DataField label="Payment Method" value="Cash on Consultation" />
                                <DataField label="Payment Status" value={appointment.status === 'Completed' ? 'Successful' : 'Pending'} isStatus statusType={appointment.status === 'Completed' ? "success" : "error"} />
                                <DataField label="Transaction ID" value="N/A" italic />
                            </div>
                        </SectionLayout>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SectionLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest border-l-4 border-blue-500 pl-4">{title}</h3>
            <div className="bg-gray-50/20 border border-gray-100/50 rounded-2xl p-6 lg:p-8">
                {children}
            </div>
        </section>
    )
}

function DataField({
    label,
    value,
    fullWidth,
    isStatus,
    statusType,
    italic,
    capitalize
}: {
    label: string;
    value: string;
    fullWidth?: boolean;
    isStatus?: boolean;
    statusType?: "success" | "error";
    italic?: boolean;
    capitalize?: boolean;
}) {
    return (
        <div className={cn(fullWidth ? "col-span-full" : "")}>
            <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest mb-2">{label}</p>
            <p className={cn(
                "text-xs font-black",
                isStatus ? (statusType === "success" ? "text-emerald-500" : "text-rose-500") : "text-gray-700",
                italic && "italic",
                capitalize && "capitalize"
            )}>
                {value || "N/A"}
            </p>
        </div>
    )
}
