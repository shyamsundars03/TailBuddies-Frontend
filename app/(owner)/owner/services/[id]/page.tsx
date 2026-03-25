"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Phone, Video, Star, MapPin, ChevronLeft, ShieldCheck, Award, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { Overview } from "@/components/owner/DoctorTabs/Overview"
import { Reviews } from "@/components/owner/DoctorTabs/Reviews"
import { BusinessHours } from "@/components/owner/DoctorTabs/BusinessHours"
import { doctorApi } from "@/lib/api/doctor/doctor.api"
import { toast } from "sonner"

export default function DoctorProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [doctor, setDoctor] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'Overview' | 'Reviews' | 'BusinessHours'>('Overview')

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!params.id) return
            setIsLoading(true)
            const response = await doctorApi.getById(params.id as string)
            if (response.success) {
                const doc = response.data
                if (!doc.isActive || !doc.isVerified) {
                    toast.error("This doctor is currently unavailable")
                    router.push('/owner/services')
                    return
                }
                setDoctor(doc)
            } else {
                toast.error(response.error || "Failed to load doctor profile")
            }
            setIsLoading(false)
        }
        fetchDoctor()
    }, [params.id])

    if (isLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-blue-600 font-black animate-pulse uppercase tracking-widest text-xl">Loading Doctor Profile...</div>
        </div>
    }

    if (!doctor) {
        return <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
            <h1 className="text-2xl font-black text-gray-900 uppercase">Doctor Not Found</h1>
            <button onClick={() => router.push('/owner/services')} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-blue-700 transition shadow-lg">Back to Services</button>
        </div>
    }

    const doctorName = doctor.userId?.userName || "N/A"
    const doctorPic = doctor.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    const specialtyName = doctor.profile?.specialtyId?.name || doctor.profile?.designation || "Specialist"
    const location = `${doctor.clinicInfo?.clinicName || "Clinic"}, ${doctor.clinicInfo?.address?.city || "N/A"}`
    const clinicImages = [
        doctor.clinicInfo?.clinicPic,
        ...(doctor.certificates?.map((c: any) => c.certificateFile) || [])
    ].filter(Boolean).slice(0, 4)

    return (
        <div className="min-h-screen bg-white">
            <div className="space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/owner/services")}
                    className="
    px-5 py-2
    bg-blue-600
    text-white
    text-sm
    font-semibold
    rounded-lg
    shadow-sm
    hover:bg-blue-700
    transition-colors duration-200
    mb-6
  "
                >
                    Back to Services
                </button>

                {/* Profile Info Card */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-md p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-48 space-y-4">
                                    <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-50 shadow-sm relative group">
                                <Image
                                    src={doctorPic}
                                    alt={doctorName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            {/* <div className="grid grid-cols-4 gap-1.5">
                                {clinicImages.map((img, i) => (
                                    <div key={i} className="aspect-square rounded border border-gray-100 cursor-pointer hover:opacity-80 transition shadow-sm overflow-hidden">
                                        <Image src={img} alt="clinic" width={60} height={60} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div> */}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-gray-900">{doctorName}</h2>
                                            <div className="bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                                <Star size={10} className="fill-white" />
                                                4.8
                                            </div>
                                        </div>
                                        <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{specialtyName}</p>
                                    </div>

                                    <div className="flex items-start gap-2 text-gray-400">
                                        <MapPin size={16} className="shrink-0 text-blue-500 mt-0.5" />
                                        <p className="text-xs font-semibold leading-relaxed max-w-sm">{location}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded border border-gray-100 uppercase tracking-widest">
                                            {doctor.profile?.consultationFees ? `$${doctor.profile.consultationFees} Consultation` : "Free Consultation"}
                                        </span>
                                        {doctor.profile?.experienceYears && (
                                            <span className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded border border-gray-100 uppercase tracking-widest">
                                                {doctor.profile.experienceYears}+ Years Exp
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 rounded border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition shadow-sm">
                                        <Phone size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100 transition shadow-sm">
                                        <Video size={18} />
                                    </button>
                                    <Link
                                        href={`/owner/services/${params.id}/book`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                    >
                                        Book Appointment
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                                <InfoMetric
                                    icon={<ShieldCheck className="text-emerald-500" />}
                                    label="Verified"
                                    value={doctor.isVerified ? "Verified Professional" : "Under Review"}
                                />
                                <InfoMetric
                                    icon={<Award className="text-amber-500" />}
                                    label="Clinic"
                                    value={doctor.clinicInfo?.clinicName || "N/A"}
                                />
                                <InfoMetric
                                    icon={<MessageSquare className="text-blue-500" />}
                                    label="Experience"
                                    value={`${doctor.profile?.experienceYears || 0} Years`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-md">
                    <div className="flex border-b border-gray-50 bg-gray-50/30">
                        <TabButton
                            label="Overview"
                            active={activeTab === 'Overview'}
                            onClick={() => setActiveTab('Overview')}
                        />
                        <TabButton
                            label="Reviews"
                            active={activeTab === 'Reviews'}
                            onClick={() => setActiveTab('Reviews')}
                        />
                        <TabButton
                            label="Business Hours"
                            active={activeTab === 'BusinessHours'}
                            onClick={() => setActiveTab('BusinessHours')}
                        />
                    </div>

                    <div className="p-8">
                        {activeTab === 'Overview' && <Overview doctor={doctor} />}
                        {activeTab === 'Reviews' && <Reviews doctorId={doctor._id} />}
                        {activeTab === 'BusinessHours' && <BusinessHours doctor={doctor} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                {icon}
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</h4>
                <p className="text-xs font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2",
                active
                    ? "text-blue-600 border-blue-600 bg-white"
                    : "text-gray-400 border-transparent hover:text-gray-600"
            )}
        >
            {label}
        </button>
    )
}
