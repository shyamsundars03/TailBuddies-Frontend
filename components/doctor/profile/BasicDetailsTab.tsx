"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { User, Mail, Phone, Clock, AlertCircle, Briefcase, Award, Stethoscope, Info, Check, Shield, TrendingUp } from 'lucide-react'
import { basicDetailsSchema } from '../../../lib/validation/doctor/doctor.schema'
import { cn } from '@/lib/utils/utils'

interface BasicDetailsProps {
    user: any;
    doctor: any;
    onUpdate: (data: any) => void;
    isEditable?: boolean;
}

export const BasicDetailsTab = ({ user, doctor, onUpdate, isEditable = true }: BasicDetailsProps) => {
    // PERSONAL INFO STATE
    const [personalData, setPersonalData] = useState({
        userName: doctor?.userId?.userName || user?.userName || "",
        gender: doctor?.userId?.gender || user?.gender || "male",
        phone: doctor?.userId?.phone || user?.phone || "",
    })

    // PROFESSIONAL INFO STATE
    const [profData, setProfData] = useState({
        specialtyId: doctor?.profile?.specialtyId?._id || doctor?.profile?.specialtyId || "",
        designation: doctor?.profile?.designation || "",
        keywords: doctor?.profile?.keywords || [],
        consultationFees: doctor?.profile?.consultationFees || 0,
        about: doctor?.profile?.about || "",
        experienceYears: doctor?.profile?.experienceYears || 0
    })

    const [specialties, setSpecialties] = useState<any[]>([])
    const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null)
    
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmittingPersonal, setIsSubmittingPersonal] = useState(false)
    const [isSubmittingProf, setIsSubmittingProf] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const loadSpecialties = async () => {
            console.log("[BasicDetailsTab] Fetching specialties...");
            const response = await doctorApi.getSpecialties()
            console.log("[BasicDetailsTab] Specialties response:", response);
            
            if (response.success && response.data) {
                console.log(`[BasicDetailsTab] Loaded ${response.data.length} specialties`);
                setSpecialties(response.data)
                
                // Set initial selected specialty based on doctor's current data
                const currentSpId = doctor?.profile?.specialtyId?._id || doctor?.profile?.specialtyId;
                if (currentSpId) {
                    const match = response.data.find((s: any) => s._id === currentSpId);
                    if (match) {
                        console.log("[BasicDetailsTab] Auto-selected specialty:", match.name);
                        setSelectedSpecialty(match);
                    }
                } else if (doctor?.profile?.designation) {
                    // Fallback to finding by designation if ID isn't set yet
                    const match = response.data.find((s: any) => 
                        s.commonDesignation.includes(doctor.profile.designation)
                    )
                    if (match) setSelectedSpecialty(match)
                }
            } else {
                console.error("[BasicDetailsTab] Failed to load specialties:", response.error);
                toast.error("Specialties could not be loaded. Please check if the server is running.")
            }
        }
        loadSpecialties()
    }, [doctor])

    useEffect(() => {
        if (doctor) {
            setPersonalData({
                userName: doctor.userId?.userName || user?.userName || "",
                gender: doctor.userId?.gender || user?.gender || "male",
                phone: doctor.userId?.phone || user?.phone || "",
            })
            setProfData({
                specialtyId: doctor.profile?.specialtyId?._id || doctor.profile?.specialtyId || "",
                designation: doctor.profile?.designation || "",
                keywords: doctor.profile?.keywords || [],
                consultationFees: doctor.profile?.consultationFees || 0,
                about: doctor.profile?.about || "",
                experienceYears: doctor.profile?.experienceYears || 0
            })
        }
    }, [doctor, user])

    const validateField = (name: string, value: any) => {
        const fieldData = { ...personalData, [name]: value };
        const result = basicDetailsSchema.safeParse(fieldData);
        
        if (!result.success) {
            const error = (result.error as any).errors.find((err: any) => err.path[0] === name);
            setErrors(prev => ({ ...prev, [name]: error ? error.message : "" }));
        } else {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }

    const handleBlur = (name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, (personalData as any)[name]);
    }

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setPersonalData(prev => ({ ...prev, [name]: value }))
        if (touched[name]) validateField(name, value);
    }

    const handleProfChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfData(prev => ({ ...prev, [name]: value }))
    }

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const specialtyId = e.target.value
        const found = specialties.find(s => s._id === specialtyId)
        setSelectedSpecialty(found)
        setProfData(prev => ({
            ...prev,
            specialtyId: specialtyId,
            designation: "", // Reset designation when specialty changes
            keywords: []     // Reset keywords when specialty changes
        }))
    }

    const toggleKeyword = (keyword: string) => {
        setProfData(prev => {
            const current = [...prev.keywords]
            if (current.includes(keyword)) {
                return { ...prev, keywords: current.filter(k => k !== keyword) }
            } else {
                return { ...prev, keywords: [...current, keyword] }
            }
        })
    }

    const getMaxFee = (count: number) => {
        if (count < 50) return 350;
        if (count <= 100) return 400;
        if (count <= 200) return 500;
        return 1000;
    }

    const appointmentCount = doctor?.totalAppointments || 0;
    const maxAllowedFee = getMaxFee(appointmentCount);

    const handleSavePersonal = async () => {
        const result = basicDetailsSchema.safeParse(personalData)
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            (result.error as any).errors.forEach((err: any) => {
                newErrors[err.path[0] as string] = err.message;
            });
            setErrors(newErrors);
            setTouched({ userName: true, gender: true, phone: true });
            toast.error("Please fix validation errors")
            return
        }

        setIsSubmittingPersonal(true)
        const response = await doctorApi.updateProfile({
            ...personalData,
            profile: { ...doctor?.profile }
        })

        if (response.success) {
            toast.success("Personal information updated successfully")
            onUpdate(response.data)
        } else {
            toast.error(response.error || "Update failed")
        }
        setIsSubmittingPersonal(false)
    }

    const handleSaveProfessional = async () => {
        if (!profData.designation) {
            toast.error("Designation is required")
            return
        }
        if (profData.about.length < 10 || profData.about.length > 200) {
            toast.error("About text must be between 10 and 200 characters")
            return
        }
        if (profData.consultationFees > maxAllowedFee) {
            toast.error(`Max consultation fee allowed is ${maxAllowedFee} based on your ${appointmentCount} appointments`)
            return
        }

        setIsSubmittingProf(true)
        const response = await doctorApi.updateProfile({
            ...personalData, // Keep personal data synchronized
            profile: {
                ...doctor?.profile,
                ...profData
            }
        })

        if (response.success) {
            toast.success("Professional details updated successfully")
            onUpdate(response.data)
        } else {
            toast.error(response.error || "Update failed")
        }
        setIsSubmittingProf(false)
    }

    return (
        <div className="space-y-12">
            {/* Section 1: Personal Information */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <User size={20} className="text-blue-600" />
                            </div>
                            Personal Information
                        </h3>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Your public profile identity</p>
                    </div>
                    {isEditable && (
                        <button
                            onClick={handleSavePersonal}
                            disabled={isSubmittingPersonal}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {isSubmittingPersonal ? "SAVING..." : "SAVE PERSONAL INFO"}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Full Name</label>
                        <input
                            type="text"
                            name="userName"
                            value={personalData.userName}
                            onChange={handlePersonalChange}
                            onBlur={() => handleBlur('userName')}
                            className={cn(
                                "w-full px-5 py-3.5 bg-gray-50 border rounded-2xl text-sm outline-none transition-all font-bold",
                                touched.userName && errors.userName ? "border-red-300 bg-red-50 text-red-900" : "border-gray-100 focus:border-blue-500 text-black"
                            )}
                        />
                        {touched.userName && errors.userName && (
                            <p className="text-[10px] text-red-500 font-black flex items-center gap-1">
                                <AlertCircle size={10} /> {errors.userName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 opacity-60 cursor-not-allowed">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Email Address</label>
                        <div className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-500 flex items-center font-bold">
                            {user?.email || "N/A"}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={personalData.phone}
                            onChange={handlePersonalChange}
                            onBlur={() => handleBlur('phone')}
                            className={cn(
                                "w-full px-5 py-3.5 bg-gray-50 border rounded-2xl text-sm outline-none transition-all font-bold",
                                touched.phone && errors.phone ? "border-red-300 bg-red-50 text-red-900" : "border-gray-100 focus:border-blue-500 text-black"
                            )}
                        />
                        {touched.phone && errors.phone && (
                            <p className="text-[10px] text-red-500 font-black flex items-center gap-1">
                                <AlertCircle size={10} /> {errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Gender</label>
                        <select
                            name="gender"
                            value={personalData.gender}
                            onChange={handlePersonalChange}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none font-bold"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button
                        onClick={() => router.push('/doctor/profile/change-email')}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-wider"
                    >
                        <Mail size={16} className="text-blue-500" />
                        CHANGE EMAIL
                    </button>
                    <button
                        onClick={() => router.push('/doctor/profile/change-password')}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-wider"
                    >
                        <Shield size={16} className="text-blue-500" />
                        CHANGE PASSWORD
                    </button>
                </div>
            </div>

            {/* Section 2: Professional Details */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <Briefcase size={20} className="text-green-600" />
                            </div>
                            Professional Details
                        </h3>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Your medical qualifications & settings</p>
                    </div>
                    {isEditable && (
                        <button
                            onClick={handleSaveProfessional}
                            disabled={isSubmittingProf}
                            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-2xl text-xs font-black hover:bg-green-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-200 disabled:opacity-50"
                        >
                            {isSubmittingProf ? "SAVING..." : "SAVE PROFESSIONAL DETAILS"}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Stethoscope size={14} className="text-blue-500" />
                            Primary Specialty
                        </label>
                        <select
                            name="specialtyId"
                            value={profData.specialtyId}
                            onChange={handleSpecialtyChange}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none font-bold"
                        >
                            <option value="">Select Specialty</option>
                            {specialties.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Award size={14} className="text-blue-500" />
                            Designation
                        </label>
                        <select
                            name="designation"
                            value={profData.designation}
                            onChange={handleProfChange}
                            disabled={!selectedSpecialty}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none font-bold disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Designation</option>
                            {selectedSpecialty?.commonDesignation?.map((d: string) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} className="text-blue-500" />
                            Consultation Fee ($)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="consultationFees"
                                value={profData.consultationFees}
                                onChange={handleProfChange}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all text-black font-bold pl-12"
                            />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                             <TrendingUp size={12} className="text-blue-600" />
                             <p className="text-[9px] text-blue-700 font-black uppercase tracking-tighter">
                                Limit: ${maxAllowedFee} <span className="opacity-50">|</span> Total Appointments: {appointmentCount}
                             </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" />
                            Experience (Years)
                        </label>
                        <input
                            type="number"
                            name="experienceYears"
                            value={profData.experienceYears}
                            onChange={handleProfChange}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all text-black font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 flex-wrap">
                        Focus Areas & Specializations
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[8px] font-black ml-auto">SELECT MULTIPLE</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5 p-6 bg-gray-50 border border-gray-100 rounded-3xl min-h-[100px]">
                        {!selectedSpecialty && (
                            <div className="flex flex-col items-center justify-center w-full space-y-2 opacity-40">
                                <AlertCircle size={24} className="text-gray-400" />
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Pick a specialty to unlock keywords</p>
                            </div>
                        )}
                        {selectedSpecialty?.typicalKeywords?.map((keyword: string) => {
                            const isSelected = profData.keywords.includes(keyword)
                            return (
                                <button
                                    key={keyword}
                                    onClick={() => toggleKeyword(keyword)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all flex items-center gap-2 border shadow-sm",
                                        isSelected 
                                            ? "bg-blue-600 text-white border-blue-600 scale-105 shadow-blue-200" 
                                            : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                    )}
                                >
                                    {isSelected ? <Check size={12} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                                    {keyword.toUpperCase()}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">About Professional Journey</label>
                        <span className={cn(
                            "text-[10px] font-black px-2 py-1 rounded-lg transition-all",
                            profData.about.length < 10 || profData.about.length > 200 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                            {profData.about.length} / 200
                        </span>
                    </div>
                    <textarea
                        name="about"
                        value={profData.about}
                        onChange={handleProfChange}
                        placeholder="Share your expertise, philosophy, and medical approach with your patients..."
                        className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm outline-none focus:border-blue-500 transition-all text-black min-h-[160px] resize-none font-medium leading-relaxed"
                    />
                </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 flex items-start gap-5">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Info className="text-blue-600" size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Smart Status Management</h4>
                    <p className="text-[11px] text-blue-700 leading-relaxed font-bold opacity-80 uppercase tracking-tighter">
                        We've improved verification flow. Once verified, your status is locked. Professional details can be updated independently without triggering a re-verification cycle.
                    </p>
                </div>
            </div>
        </div>
    )
}

