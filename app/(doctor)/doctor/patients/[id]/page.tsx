"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, MapPin, Phone, Mail, FileText, Activity, Loader2, Download } from "lucide-react"
import { userPetApi } from "@/lib/api/user/pet.api"
import { appointmentApi } from "@/lib/api/appointment.api"
import { prescriptionApi } from "@/lib/api/prescription.api"
import { toast } from "sonner"
import { format, differenceInYears } from "date-fns"
import { cn } from "@/lib/utils/utils"

export default function PatientDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [patient, setPatient] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState<string | null>(null)

    const handleDownload = async (prescriptionId: string) => {
        if (!prescriptionId) return
        setIsDownloading(prescriptionId)
        const response = await prescriptionApi.downloadPdf(prescriptionId)
        if (!response.success) {
            toast.error(response.message || "Failed to download PDF")
        }
        setIsDownloading(null)
    }

    useEffect(() => {
        if (id) fetchPatientDetails()
    }, [id])

    const fetchPatientDetails = async () => {
        setIsLoading(true)
        try {
            const [petRes, apptsRes] = await Promise.all([
                userPetApi.getPetById(id as string),
                appointmentApi.getDoctorAppointments(undefined, 1, 100)
            ])

            if (petRes.success) {
                setPatient(petRes.data)
            } else {
                toast.error(petRes.error || "Failed to load pet details")
                router.back()
            }

            if (apptsRes.success) {
                // Filter appointments for this specific pet
                const petAppointments = apptsRes.data.filter((appt: any) => 
                    (appt.petId?._id || appt.petId) === id
                )
                setHistory(petAppointments)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Patient File...</p>
            </div>
        )
    }

    if (!patient) return null

    const age = patient.dob ? differenceInYears(new Date(), new Date(patient.dob)) : "N/A"

    return (
        <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-[#002B49] uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                        Patient File
                    </h2>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition border border-gray-200 active:scale-95"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                </div>

                {/* Patient Profile Header Card */}
                <div className="flex flex-col md:flex-row gap-10 mb-12">
                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-50 border-4 border-white shadow-xl shrink-0">
                        <Image 
                            src={patient.picture || "/placeholder.svg?height=128&width=128"} 
                            alt={patient.name} 
                            width={128} 
                            height={128} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-3xl font-black text-[#002B49] uppercase tracking-tight">{patient.name}</h3>
                            <span className="px-4 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                ID: {patient._id?.slice(-6).toUpperCase()}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <span className="text-[9px] font-black text-gray-400 block uppercase tracking-widest mb-1">Species</span>
                                <p className="text-sm font-black text-[#002B49] uppercase">{patient.species}</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-gray-400 block uppercase tracking-widest mb-1">Breed</span>
                                <p className="text-sm font-black text-[#002B49] uppercase">{patient.breed}</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-gray-400 block uppercase tracking-widest mb-1">Age</span>
                                <p className="text-sm font-black text-[#002B49] uppercase">{age} Years</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-gray-400 block uppercase tracking-widest mb-1">Weight</span>
                                <p className="text-sm font-black text-blue-600 uppercase">{patient.weight || "—"} KG</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <Mail size={16} className="text-blue-600" />
                                <span className="text-xs font-bold text-gray-600">{patient.ownerId?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <Phone size={16} className="text-blue-600" />
                                <span className="text-xs font-bold text-gray-600">{patient.ownerId?.phone || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - History */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#002B49] mb-8 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                Visit History
                            </h4>
                            <div className="space-y-4">
                                {history.length > 0 ? history.map((visit, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-gray-50/30 border border-gray-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-black text-[#002B49] uppercase tracking-tight mb-1">{visit.serviceType}</h5>
                                            <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {format(new Date(visit.appointmentDate), 'dd MMM yyyy')} • {visit.appointmentStartTime}</span>
                                                <span className="flex items-center gap-1.5"><Activity size={12} className="text-emerald-500" /> Mode: {visit.mode}</span>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-4 py-1.5 text-[9px] font-black rounded-xl uppercase tracking-widest",
                                            visit.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                                            visit.status === 'confirmed' ? "bg-blue-100 text-blue-600" :
                                            "bg-gray-100 text-gray-500"
                                        )}>
                                            {visit.status}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No previous visits found</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Vitals & Records */}
                    <div className="space-y-10">
                        <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#002B49] mb-8">Clinical Vitals</h4>
                            <div className="bg-[#002B49] rounded-[2.5rem] p-8 text-white space-y-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Latest Temp</span>
                                    <span className="text-2xl font-black">98.6<span className="text-sm text-blue-300 ml-1">°F</span></span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Pulse Rate</span>
                                    <span className="text-2xl font-black">72<span className="text-sm text-blue-300 ml-1">BPM</span></span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Current Weight</span>
                                    <span className="text-2xl font-black">{patient.weight || "—"}<span className="text-sm text-blue-300 ml-1">KG</span></span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#002B49] mb-8">Medical Records</h4>
                            <div className="space-y-3">
                                {history.filter(v => v.prescriptionId).map((visit, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <button 
                                            onClick={() => router.push(`/doctor/appointments/${visit._id}`)}
                                            className="flex-1 flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[10px] font-black text-[#002B49] block uppercase tracking-tight">Prescription</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{format(new Date(visit.appointmentDate), 'dd MMM yyyy')}</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">View</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(visit.prescriptionId?._id || visit.prescriptionId)}
                                            disabled={isDownloading === (visit.prescriptionId?._id || visit.prescriptionId)}
                                            className="p-5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                            title="Download Summary"
                                        >
                                            {isDownloading === (visit.prescriptionId?._id || visit.prescriptionId) ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Download size={18} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                                {history.filter(v => v.prescriptionId).length === 0 && (
                                    <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No records available</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
