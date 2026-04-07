"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Phone, Calendar, Clock, Star, Download, MessageSquare, ShieldCheck, FileText, Pill, Loader2, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { appointmentApi } from "@/lib/api/appointment.api"
import { toast } from "sonner"

export default function SingleBookingViewPage() {
    const params = useParams()
    const router = useRouter()
    const [appointment, setAppointment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!params?.id) return
            setIsLoading(true)
            const response = await appointmentApi.getAppointmentById(params.id as string)
            if (response.success) {
                setAppointment(response.data)
            } else {
                toast.error(response.error || "Failed to fetch appointment details")
            }
            setIsLoading(false)
        }
        fetchAppointment()
    }, [params?.id])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Appointment Details...</p>
            </div>
        )
    }

    if (!appointment) {
        return (
            <div className="text-center py-40">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Appointment not found</p>
                <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline">Go Back</button>
            </div>
        )
    }

    const doctorUser = appointment.doctorId?.userId;
    const pet = appointment.petId;

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
                    {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-2 rounded-xl text-xs transition active:scale-95 shadow-md flex items-center gap-2">
                        Call
                    </button> */}
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-8 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                    >
                        Back
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-8 px-10">
                {/* Header with doctor and actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <Image 
                                src={doctorUser?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                                alt="Doctor" 
                                width={48} 
                                height={48} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div>
                            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">AptID: {appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</p>
                            <h2 className="text-gray-900 font-black text-sm">Dr. {doctorUser?.username}</h2>
                        </div>
                        <div className="ml-8 flex items-center gap-3">
                            <span className="text-blue-950 font-black text-xs">Status:</span>
                            <span className={cn(
                                "font-bold text-xs uppercase px-3 py-1 rounded-full",
                                appointment.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" :
                                appointment.status === 'Booked' ? "bg-blue-100 text-blue-600" :
                                appointment.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" :
                                appointment.status === 'Booked' ? "bg-blue-100 text-blue-600" :
                                appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? "bg-red-100 text-red-600" :
                                appointment.status === 'payment pending' ? "bg-amber-100 text-amber-600" :
                                "bg-gray-100 text-gray-600"
                            )}>
                                {appointment.status}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {appointment.status === 'Booked' && (
                            <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95">
                                Reschedule
                            </button>
                        )}
                        {appointment.status === 'Completed' && (
                            <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95">
                                Write a Review
                            </button>
                        )}
                        {/* <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95 flex items-center gap-2">
                            <Download size={14} />
                            Download Summary
                        </button> */}
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Pet Section */}
                    <SectionLayout title="Pet Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DataField label="Pet Name" value={pet?.name} />
                            <DataField label="Species" value={pet?.type || pet?.species} />
                            <DataField label="Breed" value={pet?.breed} />
                        </div>
                    </SectionLayout>

                    {/* Doctor Section */}
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
                    {/* <SectionLayout title="Appointment Timeline">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                            <DataField label="Booked At" value={new Date(appointment.createdAt).toLocaleString()} />
                            <DataField label="Status" value={appointment.status} />
                            <DataField label="Delay Status" value={appointment.delayStatus || "None"} />
                        </div>
                    </SectionLayout> */}

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

                    <SectionLayout title="Payment Information">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <DataField label="Consultation Fee" value={`₹${appointment.doctorId?.profile?.consultationFees || appointment.totalAmount || 0}`} />
                            <DataField 
                                label="Payment Method" 
                                value={
                                    appointment.paymentMethod === 'razorpay' ? 'Razorpay Online' : 
                                    appointment.paymentMethod === 'wallet' ? 'Wallet Payment' : 
                                    appointment.paymentMethod === 'cash' || appointment.paymentMethod === 'cod' ? 'Cash on Consultation' : 
                                    appointment.paymentMethod || 'N/A'
                                } 
                                capitalize 
                            />
                            <DataField 
                                label="Payment Status" 
                                value={appointment.paymentStatus || (appointment.status === 'Completed' ? 'PAID' : 'PENDING')} 
                                isStatus 
                                statusType={appointment.paymentStatus === 'PAID' || appointment.status === 'Completed' ? "success" : "error"} 
                            />
                            <DataField label="Transaction ID" value={appointment.transactionID || "N/A"} italic />
                        </div>
                        
                        {appointment.status === 'payment pending' && (
                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => router.push(`/owner/payment/failure?id=${appointment._id}`)}
                                    className="bg-[#002B49] hover:bg-[#001B39] text-white font-black px-10 py-3 rounded-2xl text-xs transition active:scale-95 shadow-lg flex items-center gap-3"
                                >
                                    <CreditCard size={18} />
                                    Retry Payment
                                </button>
                            </div>
                        )}
                    </SectionLayout>

                    {/* Reviews */}
                    {appointment.review && (
                        <SectionLayout title="Reviews">
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-gray-900 text-sm">{appointment.review.user}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(appointment.review.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={cn(
                                                    i < appointment.review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                    {appointment.review.comment}
                                </p>
                            </div>
                        </SectionLayout>
                    )}
                </div>
            </div>
        </div>
    )
}

function SectionLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-tight">{title}</h3>
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
            <p className="text-blue-900/40 font-black text-[10px] uppercase tracking-wider mb-2">{label}</p>
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
