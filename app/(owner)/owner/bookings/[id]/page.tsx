"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Phone, Calendar, Clock, Star, Download, MessageSquare, ShieldCheck, FileText, Pill, Loader2, CreditCard, Activity, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { appointmentApi } from "@/lib/api/appointment.api"
import { prescriptionApi } from "@/lib/api/prescription.api"
import { toast } from "sonner"
import { useAppSelector } from "@/lib/redux/hooks"
import { useConsultation } from "@/lib/hooks/useConsultation"
import { ConsultationChat } from "@/components/consultation/ConsultationChat"
import { PrescriptionView } from "@/components/consultation/PrescriptionView"
import { ReviewModal } from "@/components/owner/ReviewModal"
import { reviewApi } from "@/lib/api/review.api"
import Swal from "sweetalert2"
import { VideoCall } from "@/components/consultation/VideoCall"
import { Video } from "lucide-react"

export default function SingleBookingViewPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const [appointment, setAppointment] = useState<any>(null)
    const [prescription, setPrescription] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'prescription' | 'video'>('details')
    const [agoraConfig, setAgoraConfig] = useState<any>(null)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [review, setReview] = useState<any>(null)

    const { messages, sendMessage, error: chatError, setError: setChatError } = useConsultation(params?.id as string, user?.id || (user as any)?._id || '', 'owner', () => {
        toast.info("Booking status updated");
        fetchAppointment();
    });

    useEffect(() => {
        if (chatError) {
            toast.error(chatError)
            setChatError(null)
        }
    }, [chatError])

    const fetchAppointment = async (isInitial = false) => {
        if (!params?.id) return
        if (isInitial) setIsLoading(true)
        const response = await appointmentApi.getAppointmentById(params.id as string)
        if (response.success) {
            setAppointment(response.data)
            if (response.data.status === 'completed') {
                const presResponse = await prescriptionApi.getByAppointmentId(params.id as string)
                if (presResponse.success) {
                    setPrescription(presResponse.data)
                }
                const reviewResponse = await reviewApi.getByAppointment(params.id as string)
                if (reviewResponse.success) {
                    setReview(reviewResponse.data)
                }
            }
        } else {
            toast.error(response.message || "Failed to fetch appointment details")
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
        console.log("Fetching Agora token for:", { channelName, userId, role: 'subscriber' });
        const response = await appointmentApi.getAgoraToken(channelName, userId, 'subscriber')
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
        fetchAppointment(true)
    }, [params?.id])

    const handleCheckIn = async () => {
        setIsActionLoading(true)
        const response = await appointmentApi.checkIn(params?.id as string, 'owner')
        if (response.success) {
            toast.success("Checked-in successfully. Live Chat is now active.")
            fetchAppointment()
            setActiveTab('chat')
        } else {
            toast.error(response.message || "Check-in failed")
        }
        setIsActionLoading(false)
    }

    const handleCheckout = async () => {
        if (!appointment) return;

        // 25-minute rule check
        const now = new Date();
        const [endH, endM] = appointment.appointmentEndTime.split(':').map(Number);
        const apptEnd = new Date(appointment.appointmentDate);
        apptEnd.setHours(endH, endM, 0, 0);
        const checkoutAllowedTime = new Date(apptEnd.getTime() - 5 * 60 * 1000);

        if (now < checkoutAllowedTime) {
            Swal.fire({
                title: 'Too Early!',
                text: `You can only checkout during the last 5 minutes of your slot (after ${checkoutAllowedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).`,
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        const result = await Swal.fire({
            title: 'End Consultation?',
            text: "Are you sure you want to checkout? This will finalize your visit.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Yes, Checkout',
            customClass: { popup: 'rounded-3xl' }
        });

        if (result.isConfirmed) {
            setIsActionLoading(true)
            const response = await appointmentApi.checkOut(params?.id as string, 'owner')
            if (response.success) {
                toast.success("Checked out successfully")
                fetchAppointment()
            } else {
                toast.error(response.message || "Checkout failed")
            }
            setIsActionLoading(false)
        }
    }

    const handlePrescriptionDownload = async () => {
        if (!prescription?._id) return
        setIsActionLoading(true)
        const response = await prescriptionApi.downloadPdf(prescription._id)
        if (!response.success) {
            toast.error(response.message || "Failed to download PDF")
        }
        setIsActionLoading(false)
    }

    const handleCancel = async () => {
        const isEmergency = appointment.status === 'confirmed' || !!appointment.checkIn?.ownerCheckInTime;
        
        const { value: reason, isConfirmed } = await Swal.fire({
            title: isEmergency ? 'Emergency Cancellation' : 'Cancel Booking',
            text: isEmergency 
                ? "You are cancelling an ongoing or confirmed appointment. This will trigger a refund request." 
                : "Are you sure you want to cancel this appointment? This action cannot be undone.",
            input: 'textarea',
            inputLabel: 'Reason for cancellation',
            inputPlaceholder: 'e.g. Pet feeling better, Emergency, Changed my mind...',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: isEmergency ? 'Yes, Cancel & Refund' : 'Yes, Cancel it',
            cancelButtonText: 'Keep it',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 py-3',
                cancelButton: 'rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 py-3'
            }
        });

        if (isConfirmed && reason) {
            setIsActionLoading(true)
            const response = await appointmentApi.updateStatus(params?.id as string, 'cancelled', reason)
            if (response.success) {
                toast.success(isEmergency ? "Cancellation and refund processed" : "Booking cancelled successfully")
                fetchAppointment()
            } else {
                toast.error(response.message || "Failed to cancel booking")
            }
            setIsActionLoading(false)
        } else if (isConfirmed && !reason) {
            toast.error("Cancellation reason is required");
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Appointment Details...</p>
            </div>
        )
    }

    if (!appointment) return null

    const doctorUser = appointment.doctorId?.userId;
    const pet = appointment.petId;
    const isConsultationActive = appointment.status === 'ongoing'
    const canJoinVideo = isConsultationActive && appointment.mode === 'online'
    const canViewChat = appointment.status === 'ongoing' || !!appointment.checkIn?.ownerCheckInTime || appointment.status === 'completed'

    console.log(appointment)
    console.log("wefwefe", prescription)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Bookings</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/bookings" className="hover:text-blue-600 transition uppercase font-bold text-[10px]">Appointments</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium uppercase text-[10px]">AptID: {appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</span>
                    </nav>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-8 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                    >
                        Back
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-8 px-10 pb-0 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={doctorUser?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"}
                                alt="Doctor" width={48} height={48} className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">AptID: TB-{appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                            <h2 className="text-gray-900 font-black text-sm">Dr. {doctorUser?.username}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={cn(
                            "font-black text-[10px] uppercase px-4 py-1.5 rounded-full tracking-widest shadow-sm",
                            appointment.status === 'confirmed' ? "bg-emerald-500 text-white" :
                                appointment.status === 'ongoing' ? "bg-blue-500 animate-pulse text-white" :
                                appointment.status === 'cancelled' ? "bg-red-500 text-white" :
                                    appointment.status === 'completed' ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                        )}>
                            {appointment.status}
                        </div>

                                 {(appointment.status === 'booked' || appointment.status === 'confirmed') && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={isActionLoading}
                                        className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                                    >
                                        {appointment.status === 'confirmed' ? 'Emergency Cancel' : 'Cancel Booking'}
                                    </button>
                                )}
                                {appointment.status === 'confirmed' && !appointment.checkIn?.ownerCheckInTime && (
                            <button
                                onClick={handleCheckIn}
                                disabled={isActionLoading}
                                className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                Check-In Now
                            </button>
                        )}
                                 {isConsultationActive && (
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isActionLoading}
                                        className="px-8 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-100 transition border border-blue-100 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} className="hidden" />}
                                        Check-Out
                                    </button>
                                )}

                                {canJoinVideo && (
                                    <button
                                        onClick={() => setActiveTab('video')}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-lg active:scale-95 flex items-center gap-2"
                                    >
                                        <Video size={14} /> Enter Call
                                    </button>
                                )}
                    
                        <div className="flex flex-col gap-3">
                            {appointment.status === 'completed' && (
                                <button
                                    onClick={() => setIsReviewOpen(true)}
                                    className={cn(
                                        "px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-lg active:scale-95 flex items-center gap-2",
                                        review 
                                            ? "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 shadow-amber-50" 
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                                    )}
                                >
                                    <Star size={14} className={review ? "fill-amber-600" : ""} />
                                    {review ? 'Edit Review' : 'Add Review & Rating'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-10 mt-8 flex gap-8 border-b border-gray-50">
                    <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<Calendar size={14} />} label="Overview" />
                    {canViewChat && (
                        <TabButton 
                            active={activeTab === 'chat'} 
                            onClick={() => setActiveTab('chat')} 
                            icon={<MessageSquare size={14} />} 
                            label={appointment.status === 'completed' ? "History" : "Live Chat"} 
                        />
                    )}
                    {isConsultationActive && appointment.mode === 'online' && (
                        <TabButton 
                            active={activeTab === 'video'} 
                            onClick={() => setActiveTab('video')} 
                            icon={<Video size={14} />} 
                            label="Video Call" 
                        />
                    )}
                    {prescription && (
                        <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<FileText size={14} />} label="Medical Record" />
                    )}
                </div>

                <div className="p-10">
                    {activeTab === 'details' && (
                        <div className="space-y-10 animate-in fade-in duration-300">
                            {/* Check-in Tracking */}
                            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Tracking</h4>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                        appointment.status === 'ongoing' ? "bg-blue-500 text-white animate-pulse" : "bg-gray-200 text-gray-500"
                                    )}>
                                        {appointment.status}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between",
                                        appointment.checkIn?.ownerCheckInTime ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100 opacity-60"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", appointment.checkIn?.ownerCheckInTime ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400")}>
                                                <Activity size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase">Your Status</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{appointment.checkIn?.ownerCheckInTime ? "Checked In" : "Not Arrived"}</p>
                                            </div>
                                        </div>
                                        {appointment.checkIn?.ownerCheckInTime && (
                                            <p className="text-xs font-black text-emerald-600">{new Date(appointment.checkIn.ownerCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between",
                                        appointment.checkIn?.vetCheckInTime ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100 opacity-60"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", appointment.checkIn?.vetCheckInTime ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400")}>
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase">Doctor Status</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{appointment.checkIn?.vetCheckInTime ? "Arrived" : "Waiting for Doctor..."}</p>
                                            </div>
                                        </div>
                                        {appointment.checkIn?.vetCheckInTime && (
                                            <p className="text-xs font-black text-blue-600">{new Date(appointment.checkIn.vetCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <SectionLayout title="Pet Information">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <DataField label="Pet Name" value={pet?.name} />
                                    <DataField label="Species" value={pet?.species} />
                                    <DataField label="Breed" value={pet?.breed} />
                                </div>
                            </SectionLayout>

                            {/* Booking Details */}
                            <SectionLayout title="Booking Details">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <DataField label="Service" value={appointment.serviceType} />
                                        <DataField label="Visit Mode" value={appointment.mode} capitalize />
                                        <DataField label="Consultation Fee" value={`₹${appointment.totalAmount}`} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <DataField label="Scheduled Date" value={new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                                        <DataField label="Time Window" value={`${appointment.appointmentStartTime} - ${appointment.appointmentEndTime}`} />
                                        <DataField label="Payment Status" value={appointment.paymentStatus} isStatus statusType={appointment.paymentStatus === 'PAID' ? 'success' : 'error'} />
                                    </div>
                                    {appointment.checkIn?.ownerCheckInTime && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-gray-50">
                                            <DataField label="Check-In Time" value={new Date(appointment.checkIn.ownerCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                                            {appointment.checkOut?.ownerCheckOutTime && (
                                                <DataField label="Check-Out Time" value={new Date(appointment.checkOut.ownerCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </SectionLayout>

                            {/* Problem */}
                            <SectionLayout title="Problem Description">
                                <p className="text-xs font-medium text-gray-500 leading-relaxed italic border-l-4 border-blue-100 pl-4">
                                    {appointment.problemDescription || "No description provided"}
                                </p>
                            </SectionLayout>

                            {review && (
                                <SectionLayout title="My Feedback">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={18} 
                                                        className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
                                                Rating: {review.rating}/5
                                            </span>
                                        </div>
                                        <div className="bg-white/50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                                            <p className="text-sm font-medium text-gray-700 italic leading-relaxed">
                                                "{review.comment || "No comment provided"}"
                                            </p>
                                        </div>

                                        {review.isReplied && review.reply && (
                                            <div className="ml-6 md:ml-10 bg-emerald-50/30 rounded-2xl p-6 space-y-3 border border-emerald-100/30 relative before:absolute before:-left-6 before:top-8 before:w-6 before:h-0.5 before:bg-emerald-100">
                                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                    <CheckCircle2 size={14} /> Doctor's Response
                                                </div>
                                                <p className="text-xs font-medium text-gray-600 leading-relaxed italic pl-4 border-l-2 border-emerald-100">
                                                    {review.reply.comment}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </SectionLayout>
                            )}

                            {/* Cancellation Details */}
                            {appointment.status === 'cancelled' && appointment.cancellation && (
                                <SectionLayout title="Cancellation Details">
                                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DataField 
                                                label="Cancelled By" 
                                                value={
                                                    appointment.cancellation.cancelledBy && typeof appointment.cancellation.cancelledBy === 'object' 
                                                        ? appointment.cancellation.cancelledBy.username 
                                                        : appointment.cancellation.cancelledBy === appointment.ownerId?._id 
                                                            ? `${appointment.ownerId?.username} (Pet Owner)` 
                                                            : appointment.cancellation.cancelledBy === appointment.doctorId?.userId?._id 
                                                                ? `Dr. ${appointment.doctorId?.userId?.username} (Doctor)`
                                                                : "System/Staff"
                                                } 
                                                capitalize 
                                            />
                                            <DataField 
                                                label="Cancelled At" 
                                                value={new Date(appointment.cancellation.cancelledAt).toLocaleString('en-GB', { 
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })} 
                                            />
                                        </div>
                                        <div className="pt-4 border-t border-red-100/50">
                                            <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest mb-2">Reason for Cancellation</p>
                                            <p className="text-xs font-medium text-red-600 italic leading-relaxed">
                                                "{appointment.cancellation.cancelReason || "No reason provided"}"
                                            </p>
                                        </div>
                                    </div>
                                </SectionLayout>
                            )}

                            {/* Transaction */}
                            <SectionLayout title="Transaction Info">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DataField label="Method" value={appointment.paymentMethod  == "cod" ? "Cash After Consultation" : appointment.paymentMethod } capitalize />
                                    <DataField label="Transaction Reference" value={appointment.transactionID || "N/A"} italic />
                                </div>
                            </SectionLayout>
                        </div>
                    )}

                    {activeTab === 'chat' && canViewChat && (
                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <ConsultationChat
                                messages={messages}
                                onSendMessage={sendMessage}
                                currentUserId={user?.id || (user as any)?._id || ''}
                                isReadOnly={appointment.status === 'completed' || appointment.status === 'cancelled'}
                            />
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
                                    localName={user?.username ?? undefined}
                                    remoteName={`Dr. ${appointment.doctorId?.userId?.username}`}
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

                    {activeTab === 'prescription' && prescription && (
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

            <ReviewModal 
                isOpen={isReviewOpen} 
                onClose={() => setIsReviewOpen(false)} 
                appointmentId={appointment._id}
                existingReview={review}
                onSuccess={fetchAppointment}
            />
        </div>
    )
}

function SectionLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">{title}</h3>
            <div className="bg-gray-50/30 border border-gray-100/50 rounded-3xl p-8">
                {children}
            </div>
        </section>
    )
}

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

function TabButton({ active, onClick, icon, label }: any) {
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
