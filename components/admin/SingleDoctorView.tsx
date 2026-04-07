"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle, XCircle, Clock, MapPin, Calendar } from 'lucide-react'
import { doctorApi } from '../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { cn } from '@/lib/utils/utils'

export function SingleDoctorView({ id }: { id: string }) {
    const router = useRouter()
    const [doctor, setDoctor] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDoctor()
    }, [id])

    const fetchDoctor = async () => {
        setLoading(true)
        const response = await (doctorApi as any).getAdminById(id)
        
        if (response.success) {
            setDoctor(response.data)
        } else {
            toast.error("Failed to load doctor details")
        }
        setLoading(false)
    }

    const handleSectionVerify = async (section: string, status: boolean) => {
        const response = await doctorApi.verifyDoctor(id, { 
            isVerified: doctor.isVerified, // Keep current overall status
            verificationStatus: { [section]: status } 
        })
        if (response.success) {
            toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} ${status ? 'verified' : 'unverified'}`)
            fetchDoctor()
        } else {
            toast.error(response.error || "Update failed")
        }
    }

    const handleVerify = async (status: boolean) => {
        // Check if all sections are verified before approving
        if (status) {
            const sections = ['clinic', 'education', 'experience', 'certificates']
            const unverified = sections.filter(s => !doctor.verificationStatus?.[s])
            if (unverified.length > 0) {
                toast.error(`Cannot approve. The following sections are unverified: ${unverified.join(', ')}`)
                return
            }
        }

        const action = status ? 'verify' : 'reject'
        let rejectionReason = ''

        if (!status) {
            const { value: reason } = await Swal.fire({
                title: 'Rejection Reason',
                input: 'textarea',
                inputPlaceholder: 'Type your reason here...',
                showCancelButton: true
            })
            if (!reason) return
            rejectionReason = reason
        }

        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${action} this doctor?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action}!`
        })

        if (result.isConfirmed) {
            const response = await doctorApi.verifyDoctor(id, { isVerified: status, rejectionReason })
            if (response.success) {
                toast.success(`Doctor ${action}ed successfully`)
                fetchDoctor()
            } else {
                toast.error(response.error || `Failed to ${action} doctor`)
            }
        }
    }

    const SectionHeader = ({ title, section }: { title: string, section: string }) => {
        const isVerified = (doctor.verificationStatus as any)?.[section];
        return (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> 
                    {title}
                </h3>
                {(doctor.profileStatus !== 'verified') && (
                    <button
                        onClick={() => handleSectionVerify(section, !isVerified)}
                        className={cn(
                            "flex items-center gap-2.5 px-6 py-2 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-sm border",
                            isVerified 
                                ? "bg-green-600 text-white border-green-700 hover:bg-green-700" 
                                : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                        )}
                    >
                        {isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {isVerified ? "VERIFIED" : "MARK VERIFIED"}
                    </button>
                )}
            </div>
        );
    }

    if (loading) return <div className="p-20 text-center text-gray-500">Loading doctor details...</div>
    if (!doctor) return <div className="p-20 text-center text-gray-500">Doctor not found.</div>

    const doctorName = doctor.userId?.username || "ID: " + id

    return (
        <div className="bg-gray-50/50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Doctor Verification</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/doctorVerifications')}>Verifications</span>
                            <span>/</span>
                            <span className="text-gray-400 truncate max-w-[200px]">{doctorName || 'Doctor Details'}</span>
                        </div>
                    </div>
                    <button onClick={() => router.back()} className="px-8 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition">
                        Back
                    </button>
                </div>

                {/* Enhanced Profile Card - Comprehensive Doctor Information */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-blue-600 px-8 py-4 flex justify-between items-center">
                        <h2 className="text-white font-black text-xs tracking-[0.2em]">PERSONAL & PROFESSIONAL INFORMATION</h2>
                        <div className="flex gap-2">
                            {doctor.isVerified ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-[10px] font-bold border border-green-500/30 flex items-center gap-1.5">
                                    <CheckCircle size={12} /> VERIFIED
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-100 rounded-full text-[10px] font-bold border border-yellow-500/30 flex items-center gap-1.5">
                                    <Clock size={12} /> {doctor.profileStatus?.toUpperCase() || 'INCOMPLETE'}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Avatar & Basic Identity */}
                            <div className="flex flex-col items-center gap-4 min-w-[200px]">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                        {doctor.userId?.profilePic ? (
                                            <img src={doctor.userId.profilePic} alt="Doctor" className="w-full h-full object-cover" />
                                        ) : (
                                            <MapPin className="text-blue-200" size={50} />
                                        )}
                                    </div>
                                    {doctor.isVerified && (
                                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                                            <CheckCircle size={16} fill="currentColor" className="text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">{doctor.userId?.username || "Not Provided"}</h3>
                                    <p className="text-blue-600 font-bold text-xs mt-1 uppercase tracking-wider">{doctor.profile?.designation || "Physician"}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Email Address</p>
                                        <p className="text-sm font-bold text-gray-700">{doctor.userId?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Phone Number</p>
                                        <p className="text-sm font-bold text-gray-700">{doctor.userId?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Gender</p>
                                        <p className="text-sm font-bold text-gray-700 capitalize">{doctor.userId?.gender || 'Not Specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Specialty</p>
                                        <p className="text-sm font-bold text-gray-700">{doctor.profile?.specialtyId?.name || 'Not Selected'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Experience</p>
                                        <p className="text-sm font-bold text-gray-700">{doctor.profile?.experienceYears || 0} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Consultation Fee</p>
                                        <p className="text-sm font-bold text-gray-700">₹{doctor.profile?.consultationFees || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">About / Biography</p>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        {doctor.profile?.about || 'No biography provided by the doctor.'}
                                    </p>
                                </div>

                                {doctor.profile?.keywords && doctor.profile.keywords.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Specializations & Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.profile.keywords.map((kw: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200 uppercase tracking-tighter">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Actions */}
                        <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
                            {doctor.profileStatus === 'rejected' && (
                                <div className="flex-1 flex items-center bg-red-50 px-4 py-2 rounded-2xl border border-red-100 mr-auto">
                                    <XCircle size={14} className="text-red-500 mr-3" />
                                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">Rejected: {doctor.rejectionReason}</p>
                                </div>
                            )}
                            <button 
                                onClick={() => handleVerify(false)} 
                                className="px-8 py-2.5 bg-white text-red-500 rounded-2xl text-[10px] font-black tracking-widest border border-red-100 hover:bg-red-50 transition shadow-sm"
                            >
                                REJECT PROFILE
                            </button>
                            <button 
                                onClick={() => handleVerify(true)} 
                                className="px-10 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition active:scale-95"
                            >
                                APPROVE DOCTOR
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 space-y-12">
                    {/* Clinic Details Section */}
                    <div>
                        <SectionHeader title="Clinic Details" section="clinic" />
                        <div className="flex flex-col md:flex-row gap-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="w-full md:w-64 h-48 rounded-2xl bg-white overflow-hidden border border-gray-200 shadow-sm">
                                {doctor.clinicInfo?.clinicPic ? (
                                    <img src={doctor.clinicInfo.clinicPic} alt="Clinic" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <MapPin size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h4 className="text-lg font-black text-gray-900">{doctor.clinicInfo?.clinicName || "Clinic Name Not Provided"}</h4>
                                    <div className="flex items-start gap-2 text-gray-500 text-xs mt-2 font-medium">
                                        <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p>
                                            {doctor.clinicInfo?.address ? 
                                                `${doctor.clinicInfo.address.doorNo}, ${doctor.clinicInfo.address.street}, ${doctor.clinicInfo.address.city}, ${doctor.clinicInfo.address.state} - ${doctor.clinicInfo.address.pincode}` : 
                                                "Address not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-6">
                                    <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                        <span className={cn(
                                            "text-xs font-black",
                                            doctor.verificationStatus?.clinic ? "text-green-600" : "text-yellow-600"
                                        )}>
                                            {doctor.verificationStatus?.clinic ? 'ADDRESS VERIFIED' : 'PENDING VERIFICATION'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <SectionHeader title="Education" section="education" />
                            <div className="space-y-6">
                                {doctor.education?.length > 0 ? doctor.education.map((edu: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                                        <p className="text-sm text-gray-500">{edu.institute}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                            </span>
                                            {edu.educationFile && (
                                                <a 
                                                    href={edu.educationFile} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] text-blue-600 font-black hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all hover:bg-blue-100"
                                                >
                                                    <FileText size={14} /> VIEW DOCUMENT
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-400 italic">No education records provided.</p>}
                            </div>
                        </div>

                        <div>
                            <SectionHeader title="Experience" section="experience" />
                            <div className="space-y-6">
                                {doctor.experience?.length > 0 ? doctor.experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800">{exp.role}</h4>
                                        <p className="text-sm text-gray-500">{exp.organization}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                                            </span>
                                            {exp.experienceFile && (
                                                <a 
                                                    href={exp.experienceFile} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] text-blue-600 font-black hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-all hover:bg-blue-100"
                                                >
                                                    <FileText size={14} /> VIEW EXPERIENCE
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-400 italic">No experience records provided.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                        <SectionHeader title="Consultation Availability" section="businessHours" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {doctor.businessHours?.map((day: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-gray-800 text-sm">{day.day}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${day.isWorking ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                            {day.isWorking ? 'ACTIVE' : 'OFF'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {day.isWorking ? day.slots.slice(0, 4).map((slot: string, sIdx: number) => (
                                            <span key={sIdx} className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-[10px] text-gray-500 font-medium">
                                                {slot}
                                            </span>
                                        )) : <span className="text-[10px] text-gray-400 italic">Not available</span>}
                                        {day.isWorking && day.slots.length > 4 && (
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">+{day.slots.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certificates */}
                    <div>
                        <SectionHeader title="Professional Certificates" section="certificates" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doctor.certificates?.length > 0 ? doctor.certificates.map((cert: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">{cert.certificateName}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{cert.issuedBy}, {cert.issuedYear}</p>
                                    </div>
                                    <a 
                                        href={cert.certificateFile} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-200 transition active:scale-95"
                                    >
                                        <FileText size={18} />
                                    </a>
                                </div>
                            )) : <p className="text-sm text-gray-400 italic col-span-2">No additional certificates uploaded.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
