"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Plus, Clock, User, Heart, Activity, FileText, Pill, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/utils"
import { prescriptionApi } from "@/lib/api/prescription.api"
import { toast } from "sonner"
import { format } from "date-fns"

export default function MedicalRecordDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [record, setRecord] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        const fetchRecord = async () => {
            setIsLoading(true)
            // The ID in the URL can be either the prescription ID or appointment ID
            // We first try to get by prescription ID, then by appointment ID if needed
            let response = await prescriptionApi.getById(id)
            
            if (!response.success) {
                // Try fetching by appointment ID as a fallback
                response = await prescriptionApi.getByAppointmentId(id)
            }

            if (response.success) {
                setRecord(response.data)
            } else {
                toast.error("Failed to load medical record")
                // router.push("/owner/medical-records")
            }
            setIsLoading(false)
        }

        if (id) {
            fetchRecord()
        }
    }, [id])

    const handleDownload = async () => {
        if (!record?._id) return
        setIsDownloading(true)
        const response = await prescriptionApi.downloadPdf(record._id)
        if (!response.success) {
            toast.error("Failed to download PDF summary")
        }
        setIsDownloading(false)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Retrieving Medical Data...</p>
            </div>
        )
    }

    if (!record) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <FileText className="w-16 h-16 text-gray-200 mb-4" />
                <h2 className="text-xl font-black text-[#002B49] uppercase tracking-tight">Record Not Found</h2>
                <p className="text-sm text-gray-400 mt-2 mb-8">We couldn't find the medical record you're looking for.</p>
                <button 
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-lg shadow-blue-100 active:scale-95"
                >
                    Return Back
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#002B49] mb-2 uppercase tracking-tight">Medical Record</h1>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Link href="/owner/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                        <span>/</span>
                        <Link href="/owner/medical-records" className="text-blue-600 hover:underline">Medical Records</Link>
                        <span>/</span>
                        <span className="text-gray-300">#{record.prescriptionId || record._id.slice(-8).toUpperCase()}</span>
                    </div>
                </div>
                <button 
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-sm hover:bg-gray-50 active:scale-95 flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Listing
                </button>
            </div>

            {/* Main Record Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 sm:p-12 shadow-sm">
                <div className="flex flex-col gap-12">
                    
                    {/* Doctor Info Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-50 pb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-gray-50 shadow-md">
                                <Image 
                                    src={record.vetId?.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150"} 
                                    alt={record.vetId?.userId?.username || "Doctor Profile"} 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Prescription: {record.prescriptionId || record._id.slice(-8).toUpperCase()}</span>
                                <h3 className="text-2xl font-black text-[#002B49] block mt-1">Dr. {record.vetId?.userId?.username || "Unknown Doctor"}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(record.createdAt), 'dd MMMM yyyy')}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-md hover:shadow-xl active:scale-95 flex items-center gap-3 disabled:opacity-50"
                        >
                            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            {isDownloading ? "Generating..." : "Download Summary"}
                        </button>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-10">
                        
                        {/* Pet Info */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <Heart size={24} className="text-red-400" /> Pet:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                                <InfoItem label="Pet Name" value={record.petId?.name} />
                                <InfoItem label="Species" value={record.petId?.species} />
                                <InfoItem label="Breed" value={record.petId?.breed} />
                            </div>
                        </div>

                        {/* Vitals Info */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <Activity size={24} className="text-emerald-500" /> Vitals:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                                <InfoItem label="Temperature" value={record.vitals?.temperature ? `${record.vitals.temperature}°F` : 'N/A'} />
                                <InfoItem label="Pulse" value={record.vitals?.pulse || 'N/A'} />
                                <InfoItem label="Respiration" value={record.vitals?.respiration || 'N/A'} />
                                <InfoItem label="Weight" value={record.vitals?.weight ? `${record.vitals.weight} Kg` : 'N/A'} />
                            </div>
                        </div>

                        {/* Report Section */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <FileText size={24} className="text-blue-500" /> Clinical Report
                            </h4>
                            <div className="bg-gray-50/30 rounded-3xl p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <ReportItem label="Clinical Findings:" value={record.clinicalFindings} />
                                <ReportItem label="Diagnosis:" value={record.diagnosis} />
                                <ReportItem label="Symptoms:" value={record.symptoms?.join(', ')} />
                                <ReportItem label="Vet Notes:" value={record.vetNotes} />
                            </div>
                        </div>

                        {/* Prescription Section */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <Pill size={24} className="text-purple-500" /> Prescription
                            </h4>
                            <div className="bg-gray-50/30 rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#002B49] text-white">
                                        <tr>
                                            <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest">Medicine</th>
                                            <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest">Dosage</th>
                                            <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest">Frequency</th>
                                            <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {record.medications?.length > 0 ? record.medications.map((item: any, idx: number) => (
                                            <tr key={idx} className="bg-white hover:bg-blue-50/30 transition-colors">
                                                <td className="px-8 py-4 text-sm font-bold text-gray-700">{item.name}</td>
                                                <td className="px-8 py-4 text-sm font-medium text-gray-500 italic">{item.dosage}</td>
                                                <td className="px-8 py-4 text-sm font-bold text-blue-600">{item.frequency}</td>
                                                <td className="px-8 py-4 text-sm font-medium text-gray-500">{item.duration}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">No medications prescribed</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-6 bg-white border border-gray-50 flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-lg font-bold text-[#002B49]">{value || 'N/A'}</p>
        </div>
    )
}

function ReportItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-2">
            <h5 className="text-sm font-black text-[#002B49] uppercase tracking-wider">{label}</h5>
            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">{value || 'No information provided'}</p>
        </div>
    )
}
