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
import { reviewApi } from "@/lib/api/review.api"
import Swal from "sweetalert2"
import { Star, Trash2, Edit2, Video } from "lucide-react"
import { VideoCall } from "@/components/consultation/VideoCall"
import { PrescriptionView } from "@/components/consultation/PrescriptionView"

export default function AppointmentDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const { user } = useAppSelector((state) => state.auth)
    const [appointment, setAppointment] = useState<any>(null)
    const [prescription, setPrescription] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'prescription' | 'video'>('details')
    const [agoraConfig, setAgoraConfig] = useState<any>(null)
    const [review, setReview] = useState<any>(null)
    const [replyingTo, setReplyingTo] = useState(false)
    const [replyComment, setReplyComment] = useState("")

    const { messages, sendMessage, error: chatError, setError: setChatError } = useConsultation(id as string, user?.id || '', 'doctor', () => {
        toast.info("Appointment status updated");
        fetchDetails();
    });

    useEffect(() => {
        if (chatError) {
            toast.error(chatError)
            setChatError(null)
        }
    }, [chatError])

    const fetchDetails = async (isInitial = false) => {
        if (isInitial) setIsLoading(true)
        const response = await appointmentApi.getAppointmentById(id as string)
        if (response.success) {
            setAppointment(response.data)
            if (response.data.status === 'completed' || response.data.prescriptionId) {
                const prescRes = await prescriptionApi.getByAppointmentId(id as string)
                if (prescRes.success) setPrescription(prescRes.data)
                
                const reviewRes = await reviewApi.getByAppointment(id as string)
                if (reviewRes.success) {
                    setReview(reviewRes.data)
                    // if (reviewRes.data.isReplied) setReplyComment(reviewRes.data.reply.comment)
                }
            }
        } else {
            toast.error(response.message || "Failed to load appointment details")
            router.push("/doctor/appointments")
        }
        setIsLoading(false)
    }

    const fetchAgoraToken = async () => {
        const userId = user?.id || (user as any)?._id
        if (!appointment || !userId) {
            console.log("Cannot fetch Agora token: missing appointment or user ID", { hasAppointment: !!appointment, userId });
            return
        }
        const channelName = `consultation_${appointment._id}`
        console.log("Fetching Agora token for:", { channelName, userId, role: 'publisher' });
        const response = await appointmentApi.getAgoraToken(channelName, userId, 'publisher')
        if (response.success) {
            console.log("Agora token fetched successfully");
            setAgoraConfig({
                token: response.token,
                channelName,
                uid: userId,
                appId: process.env.NEXT_PUBLIC_AGORA_APP_ID
            })
        } else {
            console.error("Agora token fetch failed:", response.message);
            toast.error("Failed to initialize video call")
        }
    }

    useEffect(() => {
        const userId = user?.id || (user as any)?._id
        if (activeTab === 'video' && appointment?.mode === 'online' && appointment?.status === 'ongoing' && !agoraConfig && userId) {
            fetchAgoraToken()
        }
    }, [activeTab, appointment, agoraConfig, user])

    useEffect(() => {
        if (id) fetchDetails(true)
    }, [id])


function DataField({ label, value, isStatus, statusType, italic, capitalize }: any) {
    return (
        <div>
            <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest mb-1.5">{label}</p>
            <p className={cn(
                "text-xs font-black uppercase",
                isStatus ? (statusType === "success" ? "text-emerald-500" : "text-rose-500") : "text-gray-900",
                italic && "italic",
                capitalize && "capitalize"
            )}>
                {value || "N/A"}
            </p>
        </div>
    )
}





    const handleCheckIn = async () => {
        setIsActionLoading(true)
        const response = await appointmentApi.checkIn(id as string, 'doctor')
        if (response.success) {
            toast.success("Checked-in successfully")
            await fetchDetails()
            const isOnlineConsultation = appointment?.mode === 'online'
            setActiveTab(isOnlineConsultation ? 'video' : 'chat')
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
            toast.success("Prescription saved successfully! You can now checkout when ready.")
            setPrescription(response.data) // Assuming response.data is the prescription
            fetchDetails() // Refresh to update prescriptionId in appointment
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
        const isEmergency = appointment.status === 'confirmed' || !!appointment.checkIn?.vetCheckInTime;

        const { value: reason, isConfirmed } = await Swal.fire({
            title: isEmergency ? 'Emergency Cancellation' : 'Cancel Appointment',
            text: isEmergency 
                ? "You are cancelling an active or confirmed consultation. A full refund will be processed for the owner."
                : "Enter a reason for cancellation. This will notify the pet owner.",
            input: 'textarea',
            inputLabel: 'Reason for cancellation',
            inputPlaceholder: 'Enter reason here...',
            inputAttributes: {
                'aria-label': 'Enter reason here'
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: isEmergency ? 'Yes, Cancel & Refund' : 'Confirm Cancellation',
            cancelButtonText: 'Nevermind',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl font-bold uppercase text-[10px] tracking-widest',
                cancelButton: 'rounded-xl font-bold uppercase text-[10px] tracking-widest'
            }
        });

        if (isConfirmed && reason) {
            setIsActionLoading(true)
            const response = await appointmentApi.updateStatus(id as string, 'cancelled', reason)
            if (response.success) {
                toast.success(isEmergency ? "Cancellation processed and refund triggered" : "Appointment cancelled successfully")
                fetchDetails()
            } else {
                toast.error(response.message || "Failed to cancel appointment")
            }
            setIsActionLoading(false)
        } else if (isConfirmed && !reason) {
            toast.error("Cancellation reason is required");
        }
    }

    const handleManualCheckout = async () => {
        if (!appointment) return;

        // 1. Check if prescription exists
        if (!appointment.prescriptionId) {
            Swal.fire({
                title: 'Prescription Required',
                text: "Please fill out and save the E-Prescription before checking out.",
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                customClass: { popup: 'rounded-3xl' }
            });
            setActiveTab('prescription');
            return;
        }

        // 2. 25-minute rule check
        const now = new Date();
        const [endH, endM] = appointment.appointmentEndTime.split(':').map(Number);
        const apptEnd = new Date(appointment.appointmentDate);
        apptEnd.setHours(endH, endM, 0, 0);
        const checkoutAllowedTime = new Date(apptEnd.getTime() - 5 * 60 * 1000);

        if (now < checkoutAllowedTime) {
            Swal.fire({
                title: 'Premature Checkout',
                text: `You must attend at least 25 minutes of the slot. Checkout will be available after ${checkoutAllowedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
                icon: 'error',
                confirmButtonColor: '#3b82f6',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        const result = await Swal.fire({
            title: 'End Consultation?',
            text: "Are you sure you want to checkout? This will finalize the medical record.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Yes, Checkout',
            customClass: {
                popup: 'rounded-3xl'
            }
        });

        if (result.isConfirmed) {
            setIsActionLoading(true)
            const response = await appointmentApi.checkOut(id as string, 'doctor')
            if (response.success) {
                toast.success("Checked out successfully. Record finalized.")
                router.push("/doctor/appointments")
            } else {
                toast.error(response.message || "Checkout failed")
            }
            setIsActionLoading(false)
        }
    }

    const handleReplySubmit = async (isUpdate = false) => {
        if (!replyComment.trim()) {
            toast.error("Reply cannot be empty")
            return
        }

        const wordCount = replyComment.trim().split(/\s+/).filter(Boolean).length
        if (wordCount > 100) {
            toast.error("Reply cannot exceed 100 words")
            return
        }

        setIsActionLoading(true)
        const response = isUpdate 
            ? await reviewApi.updateReply(review._id, replyComment)
            : await reviewApi.reply(review._id, replyComment)

        if (response.success) {
            toast.success(isUpdate ? "Response updated" : "Response sent")
            setReplyingTo(false)
            fetchDetails()
        } else {
            toast.error(response.message || "Failed to post response")
        }
        setIsActionLoading(false)
    }

    const handleDeleteReply = async () => {
        const result = await Swal.fire({
            title: 'Delete Response?',
            text: "Are you sure you want to remove your feedback response?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete',
            customClass: { popup: 'rounded-3xl' }
        })

        if (result.isConfirmed) {
            setIsActionLoading(true)
            const response = await reviewApi.deleteReply(review._id)
            if (response.success) {
                toast.success("Response deleted")
                setReplyComment("")
                fetchDetails()
            } else {
                toast.error(response.message || "Failed to delete response")
            }
            setIsActionLoading(false)
        }
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

    const isConsultationActive = appointment.status === 'ongoing'
    const canJoinVideo = isConsultationActive && appointment.mode === 'online'
    const canViewChat = appointment.status === 'ongoing' || !!appointment.checkIn?.vetCheckInTime || appointment.status === 'completed'

    return (
        <div className="w-full space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Top Header */}
                <div className="p-8 pb-0 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#002B49] uppercase tracking-tight">Appointment Review</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs font-bold text-blue-600 uppercase">Ref: TB-{appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className={cn(
                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                appointment.status === 'confirmed' ? "bg-emerald-500 text-white" :
                                appointment.status === 'ongoing' ? "bg-blue-500 animate-pulse text-white" :
                                appointment.status === 'cancelled' ? "bg-red-500 text-white" :
                                appointment.status === 'completed' ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                            )}>
                                {appointment.status}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Action Buttons moved to Header */}
                        {appointment.status === 'confirmed' && !appointment.checkIn?.vetCheckInTime && (
                            <button
                                onClick={handleCheckIn}
                                disabled={isActionLoading}
                                className="px-6 py-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                                Start Consultation
                            </button>
                        )}
                        
                        {isConsultationActive && !appointment.checkOut?.vetCheckOutTime && (
                            <button
                                onClick={handleManualCheckout}
                                disabled={isActionLoading}
                                className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                Manual Checkout
                            </button>
                        )}

                        {(appointment.status === 'confirmed' || appointment.status === 'booked' || appointment.status === 'BOOKED') && (
                            <button
                                onClick={handleCancel}
                                disabled={isActionLoading}
                                className="px-4 py-2.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                        <div className="w-[1px] h-8 bg-gray-100 mx-2" />

                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition border border-gray-200 active:scale-95"
                        >
                            <ChevronLeft size={16} /> Close
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-8 mt-6 flex gap-8 border-b border-gray-50">
                    <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<Activity size={14}/>} label="Full Details" />
                    {canViewChat && appointment.mode !== 'online' && (
                        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={14}/>} label={appointment.status === 'completed' ? "Chat History" : "Live Consultation"} />
                    )}
                    {canJoinVideo && (
                        <TabButton active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={<Video size={14}/>} label="Video Call" />
                    )}
                    {appointment.status !== 'cancelled' && (appointment.status !== 'completed' || !appointment.prescriptionId) && (
                        <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<FileText size={14}/>} label="E-Prescription" />
                    )}
                    {appointment.status === 'completed' && appointment.prescriptionId && (
                        <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<FileText size={14}/>} label="View Medical Record" />
                    )}
                </div>

                <div className="p-8">
                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Actions & Status */}
                            {/* Check-in Tracking Dashboard */}
                            <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Consultation Status</p>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block",
                                            appointment.status === 'confirmed' ? "bg-emerald-500 text-white" :
                                            appointment.status === 'ongoing' ? "bg-blue-500 animate-pulse text-white" :
                                            appointment.status === 'cancelled' ? "bg-red-500 text-white" :
                                            appointment.status === 'completed' ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                                        )}>
                                            {appointment.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Actions now in Header */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between transition-all",
                                        appointment.checkIn?.vetCheckInTime ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100 opacity-60"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", appointment.checkIn?.vetCheckInTime ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400")}>
                                                <Activity size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase">Doctor Status (You)</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{appointment.checkIn?.vetCheckInTime ? "Arrived" : "Not Checked In"}</p>
                                            </div>
                                        </div>
                                        {appointment.checkIn?.vetCheckInTime && (
                                            <p className="text-xs font-black text-emerald-600">{new Date(appointment.checkIn.vetCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between transition-all",
                                        appointment.checkIn?.ownerCheckInTime ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100 opacity-60"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", appointment.checkIn?.ownerCheckInTime ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400")}>
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase">Pet Owner Status</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{appointment.checkIn?.ownerCheckInTime ? "Arrived" : "Waiting..."}</p>
                                            </div>
                                        </div>
                                        {appointment.checkIn?.ownerCheckInTime && (
                                            <p className="text-xs font-black text-blue-600">{new Date(appointment.checkIn.ownerCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        )}
                                    </div>
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
                                            <p className="text-xs font-black text-blue-950 uppercase">₹{appointment.totalAmount} • {appointment.paymentStatus}</p>
                                        </div>
                                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Date</p>
                                             <p className="text-xs font-black text-blue-950 uppercase">{new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Timings</p>
                                            <p className="text-xs font-black text-blue-950 uppercase">{`${appointment.appointmentStartTime} - ${appointment.appointmentEndTime}`}</p>
                                            
                                            {/* <DataField label="Time Window" value={`${appointment.appointmentStartTime} - ${appointment.appointmentEndTime}`} /> */}
                                            {/* <DataField label="Payment Status" value={appointment.paymentStatus} isStatus statusType={appointment.paymentStatus === 'PAID' ? 'success' : 'error'} /> */}
                                        </div>

                                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                           <p className="text-[9px] font-black text-gray-400 uppercase mb-1"></p>
                                            {/* <DataField label="Scheduled Date" value={new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} /> */}
                                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Status</p>
                                            <p className="text-xs font-black text-blue-950 uppercase">{appointment.paymentStatus }</p>

                                           
                                        </div>



                                    </div>
                                </section>

                                {appointment.status === 'completed' && review && (
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-950 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Patient Feedback
                                        </h3>
                                        <div className="bg-amber-50/30 rounded-[2.5rem] p-8 border border-amber-100/50 shadow-sm transition-all hover:shadow-md">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={18} 
                                                            className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-gray-100">
                                                    Rating: {review.rating}/5
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-blue-950 leading-relaxed italic mb-8 pl-4 border-l-4 border-amber-200">
                                                "{review.comment || "No written comment provided"}"
                                            </p>

                                            {/* Reply Area */}
                                            <div className="mt-8 pt-8 border-t border-amber-100/50">
                                                {replyingTo ? (
                                                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="relative">
                                                            <textarea
                                                                value={replyComment}
                                                                onChange={(e) => setReplyComment(e.target.value)}
                                                                placeholder="Write a professional response to the patient..."
                                                                className="w-full h-32 bg-white border-2 border-amber-100 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-amber-300 transition-all resize-none shadow-inner"
                                                            />
                                                            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                {replyComment.trim().split(/\s+/).filter(Boolean).length} / 100 words
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setReplyingTo(false)
                                                                    setReplyComment(review.isReplied ? review.reply.comment : "")
                                                                }}
                                                                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                                                            >
                                                                Discard
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReplySubmit(!!review.isReplied)}
                                                                disabled={isActionLoading || !replyComment.trim()}
                                                                className="px-8 py-2.5 bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/10"
                                                            >
                                                                {isActionLoading && <Loader2 size={12} className="animate-spin" />}
                                                                {review.isReplied ? "Update Response" : "Submit Response"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    review.isReplied ? (
                                                        <div className="bg-emerald-50/40 rounded-3xl p-6 border border-emerald-100/50 relative group">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                                                    <CheckCircle2 size={14} /> My Response
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button 
                                                                        onClick={() => setReplyingTo(true)}
                                                                        className="p-2 text-blue-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100"
                                                                    >
                                                                        <Edit2 size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={handleDeleteReply}
                                                                        className="p-2 text-rose-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-rose-100"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-medium text-gray-700 leading-relaxed italic pl-4 border-l-2 border-emerald-200">
                                                                {review.reply.comment}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setReplyingTo(true)}
                                                            className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 px-8 py-3 rounded-2xl border border-blue-100 font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 group shadow-sm bg-white"
                                                        >
                                                            <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                                                            Post Response to Feedback
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                <section className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-950 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Case Details
                                    </h3>
                                    <div className="bg-blue-50/30 rounded-[2rem] p-6 border border-blue-100/50 min-h-[160px]">
                                        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4 opacity-60">Submitted Problem Description</h4>
                                        <p className="text-xs font-medium text-gray-700 leading-[1.8] italic">"{appointment.problemDescription || "No initial description provided"}"</p>
                                    </div>

                                    {appointment.status === 'cancelled' && appointment.cancellation && (
                                        <div className="bg-red-50/40 rounded-[2rem] p-8 border border-red-100/50 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black text-red-900 uppercase tracking-widest opacity-60">Cancellation Details</h4>
                                                <div className="px-3 py-1 bg-white rounded-full border border-red-100 text-[9px] font-black text-red-500 uppercase">
                                                    By: {
                                                        appointment.cancellation.cancelledBy && typeof appointment.cancellation.cancelledBy === 'object' 
                                                            ? appointment.cancellation.cancelledBy.username 
                                                            : appointment.cancellation.cancelledBy === appointment.ownerId?._id 
                                                                ? `${appointment.ownerId?.username} (Pet Owner)` 
                                                                : appointment.cancellation.cancelledBy === appointment.doctorId?.userId?._id 
                                                                    ? `Dr. ${appointment.doctorId?.userId?.username} (Doctor)`
                                                                    : "System"
                                                    }
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Reason for Cancellation</p>
                                                    <p className="text-sm font-medium text-red-600 italic">
                                                        "{appointment.cancellation.cancelReason || "No reason provided"}"
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t border-red-100/50 flex justify-between items-center">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cancelled At</p>
                                                    <p className="text-[10px] font-black text-blue-900">
                                                        {new Date(appointment.cancellation.cancelledAt).toLocaleString('en-GB', { 
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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

                    {activeTab === 'chat' && canViewChat && (
                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-3">
                                    <ConsultationChat 
                                        messages={messages} 
                                        onSendMessage={sendMessage} 
                                        currentUserId={user?.id || ''} 
                                        isReadOnly={appointment.status === 'completed' || appointment.status === 'cancelled'} 
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

                    {canJoinVideo && (
                        <div className={cn("animate-in zoom-in-95 duration-500", activeTab === 'video' ? "block" : "contents")}>
                            {agoraConfig ? (
                                <VideoCall 
                                    appId={agoraConfig.appId}
                                    channelName={agoraConfig.channelName}
                                    token={agoraConfig.token}
                                    uid={agoraConfig.uid}
                                    localName={`Dr. ${user?.username}`}
                                    remoteName={appointment.ownerId?.username ?? undefined}
                                    onEndCall={() => setActiveTab('details')}
                                    minimized={activeTab !== 'video'}
                                    onExpand={() => setActiveTab('video')}
                                />
                            ) : (
                                <div className={cn("h-[600px] w-full bg-[#001524] rounded-[2.5rem] flex flex-col items-center justify-center gap-4", activeTab !== 'video' && "hidden")}>
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                                    <p className="text-white/40 text-xs font-black uppercase tracking-widest">Initializing Video Session...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'prescription' && appointment.status !== 'cancelled' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {(!prescription || appointment.status !== 'completed') ? (
                                <PrescriptionForm 
                                    onSubmit={handlePrescriptionSubmit} 
                                    isSubmitting={isActionLoading} 
                                    initialData={prescription}
                                />
                            ) : (
                                <PrescriptionView 
                                    prescription={prescription} 
                                    appointment={appointment}
                                    onDownload={handlePrescriptionDownload} 
                                />
                            )}
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
