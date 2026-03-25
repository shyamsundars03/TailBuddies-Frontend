"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Clock, Phone, Mail, ChevronLeft, Loader2, Save, XCircle, CheckCircle2 } from "lucide-react"
import { appointmentApi } from "@/lib/api/appointment.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"

export default function AppointmentDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [appointment, setAppointment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    
    // Form States
    const [vitals, setVitals] = useState({
        temperature: "",
        pulse: "",
        respiratoryRate: "",
        weight: ""
    })
    const [notes, setNotes] = useState({
        clinical: "",
        doctor: ""
    })

    const fetchDetails = async () => {
        setIsLoading(true)
        const response = await appointmentApi.getAppointmentById(id as string)
        if (response.success) {
            setAppointment(response.data)
            // Pre-fill vitals and notes if they exist (assuming future extension)
        } else {
            toast.error(response.error || "Failed to load appointment details")
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
        } else {
            toast.error(response.error || "Check-in failed")
        }
        setIsActionLoading(false)
    }

    const handleCheckOut = async () => {
        setIsActionLoading(true)
        const response = await appointmentApi.checkOut(id as string, 'doctor')
        if (response.success) {
            toast.success("Checked-out successfully")
            router.push("/doctor/appointments")
        } else {
            toast.error(response.error || "Check-out failed")
        }
        setIsActionLoading(false)
    }

    const handleCancel = async () => {
        const reason = window.prompt("Please provide a reason for cancellation:", "Emergency at clinic") || "";
        if (!reason) {
            toast.error("Cancellation reason is required");
            return;
        }

        setIsActionLoading(true)
        const response = await appointmentApi.updateStatus(id as string, 'Cancelled', reason)
        if (response.success) {
            toast.success("Appointment cancelled successfully")
            fetchDetails()
        } else {
            toast.error(response.error || "Failed to cancel appointment")
        }
        setIsActionLoading(false)
    }

    const handleSave = async () => {
        toast.info("Saving clinical details...")
        // Here we would call an API to update vitals/notes or clinicalFindings
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

    return (
        <div className="w-full space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold font-inter text-[#002B49]">Appointment Details</h2>
                        <p className="text-xs font-bold text-blue-600 uppercase mt-1">AptID: {appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition border border-gray-200"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                </div>

                {/* Status Bar */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                            appointment.status === 'Confirmed' ? "bg-emerald-500 text-white" :
                            appointment.status === 'Cancelled' ? "bg-red-500 text-white" :
                            appointment.status === 'Completed' ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                        )}>
                            {appointment.status}
                        </div>
                        {/* {appointment.checkIn?.vetCheckInTime && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                                <Clock size={14} className="text-blue-600" />
                                <span>Checked In: {new Date(appointment.checkIn.vetCheckInTime).toLocaleTimeString()}</span>
                            </div>
                        )} */}
                    </div>

                    <div className="flex items-center gap-3">
                        {appointment.status === 'Confirmed' && !appointment.checkIn?.vetCheckInTime && (
                            <button
                                // onClick={handleCheckIn}
                                // disabled={isActionLoading}
                                className="px-8 py-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 active:scale-95 flex items-center gap-2"
                            >
                                {isActionLoading && <Loader2 size={14} className="animate-spin" />}
                                Check In
                            </button>
                        )}
                        {appointment.checkIn?.vetCheckInTime && appointment.status !== 'Completed' && (
                            <button
                                // onClick={handleCheckOut}
                                // disabled={isActionLoading}
                                className="px-8 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2"
                            >
                                {isActionLoading && <Loader2 size={14} className="animate-spin" />}
                                Complete & Check Out
                            </button>
                        )}
                        {appointment.status === 'Confirmed' && (
                            <button 
                                onClick={handleCancel}
                                disabled={isActionLoading}
                                className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Vitals */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Summary */}
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#002B49] mb-6 border-b border-gray-100 pb-2">Information Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Service Type</span>
                                    <p className="text-sm font-bold text-gray-900">{appointment.serviceType}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Date & Time</span>
                                    <p className="text-sm font-bold text-gray-900">
                                        {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentStartTime}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Pet & Owner */}
                        <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                        <Image src={appointment.petId?.picture || appointment.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=128&h=128"} alt="Pet" width={64} height={64} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-blue-600 uppercase mb-0.5 block">Patient</span>
                                        <h4 className="text-lg font-bold text-gray-900 leading-tight">{appointment.petId?.name || "N/A"}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{appointment.petId?.species} • {appointment.petId?.breed}</p>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <span className="text-[9px] font-black text-blue-600 uppercase mb-1 block">Owner Contact</span>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">{appointment.ownerId?.userName}</h4>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={12}/> {appointment.ownerId?.email}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-2"><Phone size={12}/> {appointment.ownerId?.phone || "No phone provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Vitals Form */}
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#002B49] mb-6 border-b border-gray-100 pb-2">Record Vitals</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {[
                                    { key: "temperature", label: "Temp", unit: "°F" },
                                    { key: "pulse", label: "Pulse", unit: "BPM" },
                                    { key: "respiratoryRate", label: "Resp", unit: "RPM" },
                                    { key: "weight", label: "Weight", unit: "KG" }
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">{field.label}</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-black"
                                                placeholder="..."
                                                value={(vitals as any)[field.key]}
                                                onChange={(e) => setVitals({...vitals, [field.key]: e.target.value})}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 uppercase">{field.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Problem Description */}
                        <section className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
                            <h4 className="text-[10px] font-black text-[#002B49] uppercase tracking-widest mb-3">Problem Description</h4>
                            <p className="text-sm text-gray-700 leading-relaxed italic">{appointment.problemDescription || "No description provided"}"</p>
                        </section>

                        {/* Clinical Notes */}
                        {/* <section className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-[#002B49] uppercase tracking-widest mb-3">Notes & Observations</h4>
                                <textarea 
                                    rows={4} 
                                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                                    placeholder="Type clinical notes here..."
                                    value={notes.clinical}
                                    onChange={(e) => setNotes({...notes, clinical: e.target.value})}
                                />
                            </div>
                        </section> */}
                    </div>

                    {/* Right Column: Prescription / Summary */}
                    <div className="bg-gray-50/30 rounded-3xl border border-gray-100 p-6 h-fit sticky top-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#002B49] mb-8 text-center">Checkout Summary</h3>
                        
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="text-[9px] font-black text-gray-400 uppercase block mb-3">Transaction Details</span>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Consultation Fee</span>
                                        <span className="text-gray-950">${appointment.consultationFees}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-tighter">Status</span>
                                        <span className="text-amber-600 uppercase">{appointment.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* <button 
                                    onClick={handleSave}
                                    className="w-full py-3 bg-[#002B49] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#001B39] transition shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Save size={14} /> Save Progress
                                </button> */}
                                {appointment.status === 'Confirmed' && appointment.checkIn?.vetCheckInTime && (
                                    <button 
                                        onClick={handleCheckOut}
                                        className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-[0.98]"
                                    >
                                        Finalize Checkout
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-[9px] font-bold text-gray-300 uppercase leading-relaxed">
                                Please ensure all vitals and clinical notes are recorded before finalizing the checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
