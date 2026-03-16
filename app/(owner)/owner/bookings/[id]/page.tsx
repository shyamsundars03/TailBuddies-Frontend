"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Phone, Calendar, Clock, Star, Download, MessageSquare, ShieldCheck, FileText, Pill } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

// Dummy data based on Image 4
const DUMMY_APPOINTMENT = {
    id: "Apt0001",
    status: "Completed",
    doctor: {
        name: "Dr. Arun",
        image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150",
        specialization: "Dermatology",
        experience: "8 years",
        fee: "300",
        serviceType: "Normal",
        mode: "Online",
        date: "11 Nov 2025",
        time: "10.45 AM"
    },
    pet: {
        name: "Bruno",
        species: "Dog",
        breed: "Golden Retriever"
    },
    problem: {
        description: "My dog is scratching a lot and has red patches on skin.",
        symptoms: ["Itching", "Redness", "Hairloss"]
    },
    timeline: {
        bookedAt: "10 Nov 2024 - 8:30 PM",
        ownerCheckIn: "10:30 AM - 11:00 AM",
        vetCheckIn: "10:33 AM - 11:00 AM",
        delayStatus: "Slight Delay (3 mins)",
        consultationEnded: "11:00 AM"
    },
    report: {
        clinicalFindings: "Fungal infection observed around neck and belly.",
        diagnosis: "Dermatitis due to fungal infection.",
        vetNotes: "Apply antifungal ointment twice daily. Avoid wet areas.",
        recommendedTests: "None"
    },
    prescription: [
        { medicine: "Keto Shampoo", dosage: "External use", frequency: "2 times/week", duration: "3 weeks" },
        { medicine: "Antifungal Tab", dosage: "1 tablet", frequency: "Once daily", duration: "5 days" }
    ],
    payment: {
        amount: "300",
        method: "UPI (Razorpay)",
        status: "Successful",
        transactionId: "TXN-RP-882341"
    },
    review: {
        user: "Hendrita",
        date: "31 Mar 2025",
        rating: 4,
        comment: "From my first consultation through to the completion of my treatment, Dr. Edalin Hendry, my dentist, has been nothing short of extraordinary. Dental visits have always been a source of anxiety for me, but Dr. Edalin Hendry's office provided an atmosphere of calm and reassurance that I had not experienced elsewhere. Highly Recommended!",
        tags: ["Fix", "Patch"]
    }
}

export default function SingleBookingViewPage() {
    const params = useParams()
    const router = useRouter()
    const [appointment] = useState(DUMMY_APPOINTMENT)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Bookings</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/bookings" className="hover:text-blue-600 transition uppercase font-bold text-[10px]">Appointments</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium uppercase text-[10px]">AptID: {params.id}</span>
                    </nav>
                </div>
                <div className="flex gap-4">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-2 rounded-xl text-xs transition active:scale-95 shadow-md flex items-center gap-2">
                        Call
                    </button>
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
                            <Image src={appointment.doctor.image} alt={appointment.doctor.name} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">#{appointment.id}</p>
                            <h2 className="text-gray-900 font-black text-sm">{appointment.doctor.name}</h2>
                        </div>
                        <div className="ml-8 flex items-center gap-3">
                            <span className="text-blue-950 font-black text-xs">Status:</span>
                            <span className="text-gray-400 font-bold text-xs">{appointment.status}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95">
                            Reschedule
                        </button>
                        <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95">
                            Write a Review
                        </button>
                        <button className="px-6 py-2 bg-yellow-400 text-black font-black rounded-lg text-xs shadow-sm hover:bg-yellow-500 transition active:scale-95 flex items-center gap-2">
                            <Download size={14} />
                            Download Summary
                        </button>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Pet Section */}
                    <SectionLayout title="Pet:">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DataField label="Pet Name" value={appointment.pet.name} />
                            <DataField label="Species" value={appointment.pet.species} />
                            <DataField label="Breed" value={appointment.pet.breed} />
                        </div>
                    </SectionLayout>

                    {/* Doctor Section */}
                    <SectionLayout title="Doctor :">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <DataField label="Doctor Name" value={appointment.doctor.name} />
                                <DataField label="Specialization" value={appointment.doctor.specialization} />
                                <DataField label="Experience" value={appointment.doctor.experience} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <DataField label="Consultation Fee" value={appointment.doctor.fee} />
                                <DataField label="Service Type" value={appointment.doctor.serviceType} />
                                <DataField label="Mode" value={appointment.doctor.mode} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <DataField label="Date" value={appointment.doctor.date} />
                                <DataField label="Time" value={appointment.doctor.time} />
                            </div>
                        </div>
                    </SectionLayout>

                    {/* Problem & Symptoms */}
                    <SectionLayout title="Problem & symptoms">
                        <div className="space-y-6">
                            <DataField label="Problem Description" value={appointment.problem.description} fullWidth />
                            <DataField label="Symptoms Selected" value={appointment.problem.symptoms.join(", ")} />
                        </div>
                    </SectionLayout>

                    {/* Timeline */}
                    <SectionLayout title="Appointment TimeLine">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                            <DataField label="Booked At" value={appointment.timeline.bookedAt} />
                            <DataField label="Owner Check-In" value={appointment.timeline.ownerCheckIn} />
                            <DataField label="Vet Check-In" value={appointment.timeline.vetCheckIn} />
                            <DataField label="Delay Status" value={appointment.timeline.delayStatus} />
                            <DataField label="Consultation Ended" value={appointment.timeline.consultationEnded} />
                        </div>
                    </SectionLayout>

                    {/* Report */}
                    <SectionLayout title="Report">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                            <DataField label="Clinical Findings:" value={appointment.report.clinicalFindings} />
                            <DataField label="Diagnosis:" value={appointment.report.diagnosis} />
                            <DataField label="Vet Notes:" value={appointment.report.vetNotes} />
                            <DataField label="Recommended Tests:" value={appointment.report.recommendedTests} />
                        </div>
                    </SectionLayout>

                    {/* Prescription */}
                    <SectionLayout title="Prescription">
                        <div className="overflow-hidden bg-white">
                            <div className="grid grid-cols-4 py-2 border-b border-gray-50 mb-4 px-2">
                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Medicine</span>
                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Dosage</span>
                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Frequency</span>
                                <span className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider">Duration</span>
                            </div>
                            <div className="space-y-4">
                                {appointment.prescription.map((item, idx) => (
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

                    {/* Payment */}
                    <SectionLayout title="Payment">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <DataField label="Consultation Fee" value={`₹${appointment.payment.amount}`} />
                            <DataField label="Payment Method" value={appointment.payment.method} />
                            <DataField label="Payment Status" value={appointment.payment.status} isStatus statusType="success" />
                            <DataField label="Transaction ID" value={appointment.payment.transactionId} italic />
                        </div>
                    </SectionLayout>

                    {/* Reviews */}
                    <SectionLayout title="Reviews">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-sm">{appointment.review.user}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{appointment.review.date}</p>
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
                            <div className="flex gap-2">
                                {appointment.review.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                            tag === "Fix" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </SectionLayout>
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
    italic
}: {
    label: string;
    value: string;
    fullWidth?: boolean;
    isStatus?: boolean;
    statusType?: "success" | "error";
    italic?: boolean;
}) {
    return (
        <div className={cn(fullWidth ? "col-span-full" : "")}>
            <p className="text-blue-900/40 font-black text-[10px] uppercase tracking-wider mb-2">{label}</p>
            <p className={cn(
                "text-xs font-black",
                isStatus ? (statusType === "success" ? "text-emerald-500" : "text-rose-500") : "text-gray-700",
                italic && "italic"
            )}>
                {value}
            </p>
        </div>
    )
}
