"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Clock, Phone, Mail, ChevronLeft, Loader2, Save, XCircle, CheckCircle2, MessageSquare, FileText, Activity } from "lucide-react"
import { appointmentApi } from "@/lib/api/appointment.api"
import { prescriptionApi } from "@/lib/api/prescription.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"
import { useAppSelector } from "@/lib/redux/hooks"
import { useConsultation } from "@/lib/hooks/useConsultation"
import { ConsultationChat } from "@/components/consultation/ConsultationChat"
import { PrescriptionForm } from "@/components/consultation/PrescriptionForm"
import { PrescriptionView } from "@/components/consultation/PrescriptionView"

export default function AppointmentDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const { user } = useAppSelector((state) => state.auth)
    const [appointment, setAppointment] = useState<any>(null)
    const [prescription, setPrescription] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'prescription'>('details')

    const { messages, sendMessage, error: chatError, setError: setChatError } = useConsultation(id as string, user?.id || '', 'doctor')

    useEffect(() => {
        if (chatError) {
            toast.error(chatError)
            setChatError(null)
        }
    }, [chatError])

    const fetchDetails = async () => {
        setIsLoading(true)
        const response = await appointmentApi.getAppointmentById(id as string)
        if (response.success) {
            setAppointment(response.data)
            if (response.data.status === 'completed') {
                const prescRes = await prescriptionApi.getByAppointmentId(id as string)
                if (prescRes.success) setPrescription(prescRes.data)
            }
        } else {
            toast.error(response.message || "Failed to load appointment details")
            router.push("/doctor/appointments")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (id) fetchDetails()
    }, [id])

    const handleCheckIn = async () => {
        setIsActionLoading(true)
        const response = await appointmentApi.checkIn(id as string, 'doctor')
        if (response.success) {
            toast.success("Checked-in successfully")
            fetchDetails()
            setActiveTab('chat')
        } else {
            toast.error(response.message || "Check-in failed")
            fetchDetails()
        }
        setIsActionLoading(false)
    }

    const handlePrescriptionSubmit = async (data: any) => {
        setIsActionLoading(true)
        const response = await prescriptionApi.create({
            appointmentId: id,
            petId: appointment.petId?._id,
            ownerId: appointment.ownerId?._id,
            ...data
        })

        if (response.success) {
            toast.success("Prescription saved successfully! Finalizing checkout...")
            // Automatic checkout after prescription
            const checkoutRes = await appointmentApi.checkOut(id as string, 'doctor')
            if (checkoutRes.success) {
                toast.success("Consultation completed.")
                router.push("/doctor/appointments")
            } else {
                toast.error(checkoutRes.message || "Checkout failed after prescription")
                fetchDetails()
            }
        } else {
            toast.error(response.message || "Failed to save prescription")
        }
        setIsActionLoading(false)
    }

    const handlePrescriptionDownload = async () => {
        if (!prescription?._id) return
        const response = await prescriptionApi.downloadPdf(prescription._id)
        if (!response.success) {
            toast.error(response.message || "Failed to download PDF")
        }
    }

    const handleCancel = async () => {
        const reason = window.prompt("Please provide a reason for cancellation:", "Emergency at clinic") || "";
        if (!reason) {
            toast.error("Cancellation reason is required");
            return;
        }

        setIsActionLoading(true)
        const response = await appointmentApi.updateStatus(id as string, 'cancelled', reason)
        if (response.success) {
            toast.success("Appointment cancelled successfully")
            fetchDetails()
        } else {
            toast.error(response.message || "Failed to cancel appointment")
        }
        setIsActionLoading(false)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading details...</p>
            </div>
        )
    }

    if (!appointment) return null

    const isConsultationActive = !!appointment.checkIn?.vetCheckInTime && appointment.status !== 'completed' && appointment.status !== 'cancelled'

    return (
        <div className="w-full space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Top Header */}
                <div className="p-8 pb-0 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#002B49] uppercase tracking-tight">Appointment Review</h2>
                        <p className="text-xs font-bold text-blue-600 uppercase mt-1">Ref: TB-{appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition border border-gray-200 active:scale-95"
                    >
                        <ChevronLeft size={16} /> Close View
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-8 mt-6 flex gap-8 border-b border-gray-50">
                    <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<Activity size={14}/>} label="Full Details" />
                    {isConsultationActive && (
                        <>
                            <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={14}/>} label="Live Consultation" />
                            <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<FileText size={14}/>} label="E-Prescription" />
                        </>
                    )}
                    {appointment.status === 'completed' && prescription && (
                        <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<FileText size={14}/>} label="View Medical Record" />
                    )}
                </div>

                <div className="p-8">
                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Actions & Status */}
                            <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8 flex flex-wrap items-center justify-between gap-6 shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block",
                                            appointment.status === 'confirmed' ? "bg-emerald-500 text-white" :
                                                appointment.status === 'cancelled' ? "bg-red-500 text-white" :
                                                    appointment.status === 'completed' ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                                        )}>
                                            {appointment.status}
                                        </div>
                                    </div>
                                    {appointment.checkIn?.vetCheckInTime && (
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In-Time</p>
                                            <p className="text-xs font-black text-blue-900">{new Date(appointment.checkIn.vetCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {appointment.status === 'confirmed' && !appointment.checkIn?.vetCheckInTime && (
                                        <button
                                            onClick={handleCheckIn}
                                            disabled={isActionLoading}
                                            className="px-10 py-3.5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                                            Start Consultation
                                        </button>
                                    )}
                                    {appointment.status === 'confirmed' && (
                                        <button
                                            onClick={handleCancel}
                                            disabled={isActionLoading}
                                            className="px-6 py-3.5 bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                                        >
                                            Cancel Slot
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-950 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Patient File
                                    </h3>
                                    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner group relative">
                                            <Image 
                                                src={appointment.petId?.picture || appointment.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=128&h=128"} 
                                                alt="Pet" width={80} height={80} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-blue-950 leading-tight mb-1">{appointment.petId?.name || "N/A"}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="text-blue-600">{appointment.petId?.species}</span>
                                                <span className="opacity-30">•</span>
                                                <span>{appointment.petId?.breed}</span>
                                                <span className="opacity-30">•</span>
                                                <span>{appointment.petId?.gender}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Service</p>
                                            <p className="text-xs font-black text-blue-950 uppercase">{appointment.serviceType}</p>
                                        </div>
                                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Fee</p>
                                            <p className="text-xs font-black text-blue-950 uppercase">${appointment.consultationFees} • {appointment.paymentStatus}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-950 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Case Details
                                    </h3>
                                    <div className="bg-blue-50/30 rounded-[2rem] p-6 border border-blue-100/50 min-h-[160px]">
                                        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4 opacity-60">Submitted Problem Description</h4>
                                        <p className="text-xs font-medium text-gray-700 leading-[1.8] italic">"{appointment.problemDescription || "No initial description provided"}"</p>
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                                        <p className="text-[9px] font-black text-blue-600 uppercase mb-3 px-1">Owner Contact Information</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900">{appointment.ownerId?.username}</h4>
                                                <p className="text-[10px] font-bold text-gray-400">{appointment.ownerId?.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={`mailto:${appointment.ownerId?.email}`} className="p-2.5 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition shadow-sm border border-gray-200"><Mail size={16} /></a>
                                                <a href={`tel:${appointment.ownerId?.phone}`} className="p-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-xl transition shadow-sm border border-gray-200"><Phone size={16} /></a>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && isConsultationActive && (
                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-3">
                                    <ConsultationChat 
                                        messages={messages} 
                                        onSendMessage={sendMessage} 
                                        currentUserId={user?.id || ''} 
                                        isReadOnly={false} 
                                    />
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-[#002B49] rounded-3xl p-6 text-white shadow-xl">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 text-white/60">Live Consultation</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <p className="text-xs font-black uppercase">Active Session</p>
                                            </div>
                                            <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase">
                                                Please advise the owner and record your findings. Chat will be saved in pet history.
                                            </p>
                                            <button 
                                                onClick={() => setActiveTab('prescription')}
                                                className="w-full py-3 bg-white text-[#002B49] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition active:scale-95 shadow-lg"
                                            >
                                                Go to Prescription
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prescription' && isConsultationActive && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <PrescriptionForm 
                                onSubmit={handlePrescriptionSubmit} 
                                isSubmitting={isActionLoading} 
                            />
                        </div>
                    )}

                    {activeTab === 'prescription' && appointment.status === 'completed' && prescription && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <PrescriptionView 
                                prescription={prescription} 
                                appointment={appointment}
                                onDownload={handlePrescriptionDownload} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all flex items-center gap-2",
                active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
        >
            {icon} {label}
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
        </button>
    )
}
