"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Plus, Clock, User, Heart, Activity, FileText, Pill } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/utils"

export default function MedicalRecordDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [record, setRecord] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Mock data matching Image 1
    const mockRecord = {
        id: id || "REC0001",
        appointmentId: "#Apt0001",
        doctorName: "Dr. Arun",
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150",
        petName: "Bruno",
        species: "Dog",
        breed: "Golden Retriever",
        vitals: {
            temperature: "101°F",
            pulse: "Normal",
            respiration: "Normal",
            weight: "27Kg"
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
        ]
    }

    useEffect(() => {
        // Simulated fetch
        setTimeout(() => {
            setRecord(mockRecord)
            setIsLoading(false)
        }, 500)
    }, [id])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Loading Record Details...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-[#002B49] uppercase tracking-tight">
                        Medical Records <span className="text-gray-300 font-medium">/</span> {record.id}
                    </h1>
                </div>
                <button 
                    onClick={() => router.back()}
                    className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full font-black text-sm transition shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back
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
                                    src={record.doctorImage} 
                                    alt={record.doctorName} 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">{record.appointmentId}</span>
                                <h3 className="text-2xl font-black text-[#002B49] block mt-1">{record.doctorName}</h3>
                            </div>
                        </div>

                        <button className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-md hover:shadow-xl active:scale-95 flex items-center gap-3">
                            <Download size={18} />
                            Download Summary
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
                                <InfoItem label="Pet Name" value={record.petName} />
                                <InfoItem label="Species" value={record.species} />
                                <InfoItem label="Breed" value={record.breed} />
                            </div>
                        </div>

                        {/* Vitals Info */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <Activity size={24} className="text-emerald-500" /> Vitals:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                                <InfoItem label="Temperature" value={record.vitals.temperature} />
                                <InfoItem label="Pulse" value={record.vitals.pulse} />
                                <InfoItem label="Respiration" value={record.vitals.respiration} />
                                <InfoItem label="Weight" value={record.vitals.weight} />
                            </div>
                        </div>

                        {/* Report Section */}
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-[#002B49] flex items-center gap-3">
                                <FileText size={24} className="text-blue-500" /> Report
                            </h4>
                            <div className="bg-gray-50/30 rounded-3xl p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <ReportItem label="Clinical Findings:" value={record.report.clinicalFindings} />
                                <ReportItem label="Diagnosis:" value={record.report.diagnosis} />
                                <ReportItem label="Vet Notes:" value={record.report.vetNotes} />
                                <ReportItem label="Recommended Tests:" value={record.report.recommendedTests} />
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
                                        {record.prescription.map((item: any, idx: number) => (
                                            <tr key={idx} className="bg-white hover:bg-blue-50/30 transition-colors">
                                                <td className="px-8 py-4 text-sm font-bold text-gray-700">{item.medicine}</td>
                                                <td className="px-8 py-4 text-sm font-medium text-gray-500 italic">{item.dosage}</td>
                                                <td className="px-8 py-4 text-sm font-bold text-blue-600">{item.frequency}</td>
                                                <td className="px-8 py-4 text-sm font-medium text-gray-500">{item.duration}</td>
                                            </tr>
                                        ))}
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
            <p className="text-lg font-bold text-[#002B49]">{value}</p>
        </div>
    )
}

function ReportItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-2">
            <h5 className="text-sm font-black text-[#002B49] uppercase tracking-wider">{label}</h5>
            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">{value}</p>
        </div>
    )
}
