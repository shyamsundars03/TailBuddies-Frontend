"use client"

import React, { useState, useEffect } from 'react'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { MapPin, Building2, Upload, Trash2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { clinicInfoSchema } from '../../../lib/validation/doctor/doctor.schema'
import { cn } from '@/lib/utils/utils'
import type { ClinicFormData, DoctorProfileTabProps } from '@/lib/types/doctor/doctor-profile.types'

type ClinicDetailsProps = Pick<DoctorProfileTabProps, 'doctor' | 'onUpdate' | 'isEditable'>

type ClinicAddress = ClinicFormData['address'];

type ClinicAddressErrors = Partial<Record<keyof ClinicAddress, string | null>>;

type ClinicFieldErrors = {
    clinicName?: string;
    address?: ClinicAddressErrors;
};

type ClinicTouched = {
    clinicName?: boolean;
    address?: Partial<Record<keyof ClinicAddress, boolean>>;
};

export const ClinicDetailsTab = ({ doctor, onUpdate, isEditable = true }: ClinicDetailsProps) => {
    const [formData, setFormData] = useState<ClinicFormData>({
        clinicName: doctor?.clinicInfo?.clinicName || "",
        clinicPic: doctor?.clinicInfo?.clinicPic || "",
        address: {
            doorNo: doctor?.clinicInfo?.address?.doorNo || "",
            street: doctor?.clinicInfo?.address?.street || "",
            city: doctor?.clinicInfo?.address?.city || "",
            state: doctor?.clinicInfo?.address?.state || "",
            pincode: doctor?.clinicInfo?.address?.pincode || "",
        },
        location: doctor?.clinicInfo?.location?.coordinates?.length === 2
            ? { type: "Point" as const, coordinates: doctor.clinicInfo.location.coordinates as [number, number] }
            : undefined,
    })
    const [errors, setErrors] = useState<ClinicFieldErrors>({})
    const [touched, setTouched] = useState<ClinicTouched>({})
    const [uploading, setUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (doctor?.clinicInfo) {
            setFormData({
                clinicName: doctor.clinicInfo.clinicName || "",
                clinicPic: doctor.clinicInfo.clinicPic || "",
                address: {
                    doorNo: doctor.clinicInfo.address?.doorNo || "",
                    street: doctor.clinicInfo.address?.street || "",
                    city: doctor.clinicInfo.address?.city || "",
                    state: doctor.clinicInfo.address?.state || "",
                    pincode: doctor.clinicInfo.address?.pincode || ""
                },
                location: {
                    type: 'Point' as const,
                    coordinates: [
                        Number(doctor.clinicInfo.location?.coordinates?.[0] || 0),
                        Number(doctor.clinicInfo.location?.coordinates?.[1] || 0),
                    ] as [number, number],
                }
            })
        }
    }, [doctor])

    const validateField = (name: string, value: string) => {
        let schemaData = { ...formData };
        if (name.includes('address.')) {
            const field = name.split('.')[1];
            schemaData = {
                ...formData,
                address: { ...formData.address, [field]: value }
            };
        } else {
            schemaData = { ...formData, [name]: value };
        }

        const result = clinicInfoSchema.safeParse(schemaData)

        if (!result.success) {
            const fieldErrors: ClinicFieldErrors = {}
            result.error.issues.forEach(issue => {
                if (issue.path[0] === "address" && issue.path[1]) {
                    const child = issue.path[1] as keyof ClinicAddress
                    fieldErrors.address = { ...fieldErrors.address, [child]: issue.message }
                } else if (issue.path[0] === "clinicName") {
                    fieldErrors.clinicName = issue.message
                }
            })

            if (name.includes('address.')) {
                const field = name.split('.')[1] as keyof ClinicAddress
                setErrors(prev => ({
                    ...prev,
                    address: { ...prev.address, [field]: fieldErrors.address?.[field] }
                }))
            } else if (name === "clinicName") {
                setErrors(prev => ({ ...prev, clinicName: fieldErrors.clinicName }))
            }
        } else {
            if (name.includes('address.')) {
                const field = name.split('.')[1] as keyof ClinicAddress
                setErrors(prev => ({
                    ...prev,
                    address: { ...prev.address, [field]: null }
                }))
            } else if (name === "clinicName") {
                setErrors(prev => ({ ...prev, clinicName: undefined }))
            }
        }
    }

    const handleBlur = (name: string) => {
        if (name.includes('address.')) {
            const field = name.split('.')[1] as keyof ClinicAddress
            setTouched(prev => ({
                ...prev,
                address: { ...prev.address, [field]: true }
            }))
            validateField(name, formData.address[field])
        } else if (name === "clinicName") {
            setTouched(prev => ({ ...prev, clinicName: true }))
            validateField(name, formData.clinicName)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.includes('address.')) {
            const field = name.split('.')[1] as keyof ClinicAddress
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }))
            if (touched.address?.[field]) {
                validateField(name, value)
            }
        } else if (name === "clinicName") {
            setFormData(prev => ({ ...prev, clinicName: value }))
            if (touched.clinicName) {
                validateField(name, value)
            }
        }
    }

    const handleSave = async () => {
        // Mark all fields as touched
        setTouched({
            clinicName: true,
            address: {
                doorNo: true,
                street: true,
                city: true,
                state: true,
                pincode: true
            }
        })

        const result = clinicInfoSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors: ClinicFieldErrors = {}
            result.error.issues.forEach(issue => {
                if (issue.path[0] === "address" && issue.path[1]) {
                    const child = issue.path[1] as keyof ClinicAddress
                    fieldErrors.address = { ...fieldErrors.address, [child]: issue.message }
                } else if (issue.path[0] === "clinicName") {
                    fieldErrors.clinicName = issue.message
                }
            })
            setErrors(fieldErrors)
            toast.error("Please fix the errors before saving")
            return
        }

        setIsSubmitting(true)
        
        // Ensure coordinates are numbers and not NaN
        const cleanLocation = {
            type: 'Point',
            coordinates: [
                Number(formData.location?.coordinates?.[0]) || 0,
                Number(formData.location?.coordinates?.[1]) || 0
            ]
        }

        const response = await doctorApi.updateProfile({ 
            clinicInfo: {
                ...formData,
                location: cleanLocation
            }
        })

        if (response.success) {
            toast.success("Clinic details updated successfully")
            if (response.data) onUpdate(response.data)
        } else {
            toast.error(response.error || "Failed to update clinic details")
        }
        setIsSubmitting(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const response = await doctorApi.uploadDocument(file)
        setUploading(false)

        if (response.success) {
            setFormData(prev => ({ ...prev, clinicPic: response.data?.url ?? '' }))
            toast.success("Clinic picture uploaded")
        } else {
            toast.error(response.error || "Failed to upload image")
        }
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Clinic Information</h3>
                    <p className="text-sm text-gray-500">Manage your clinic details and location</p>
                </div>
                {isEditable && (
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Clinic Picture Card */}
                <div className="lg:col-span-1 space-y-3">
                    <label className="text-sm font-bold text-gray-700">Clinic Header Image</label>
                    <div className="relative w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group transition-colors hover:border-blue-300">
                        {formData.clinicPic ? (
                            <>
                                <Image 
                                    src={formData.clinicPic} 
                                    alt="Clinic" 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                                {isEditable && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                        <label className="p-3 bg-white rounded-full cursor-pointer hover:bg-gray-100 shadow-lg">
                                            <Upload size={20} className="text-blue-600" />
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                        <button 
                                            onClick={() => setFormData(prev => ({ ...prev, clinicPic: "" }))}
                                            className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-lg"
                                        >
                                            <Trash2 size={20} className="text-red-600" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <label className={cn("flex flex-col items-center p-6 text-center", isEditable ? "cursor-pointer" : "cursor-not-allowed")}>
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Building2 size={32} className="text-blue-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-900 mb-1">{uploading ? "Uploading..." : isEditable ? "Click to upload" : "No image uploaded"}</span>
                                <span className="text-[10px] text-gray-400">JPG, PNG or WEBP (Max 5MB)</span>
                                {isEditable && <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />}
                            </label>
                        )}
                    </div>
                </div>

                {/* Information Fields */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Clinic Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Clinic Name</label>
                        <input
                            type="text"
                            name="clinicName"
                            value={formData.clinicName}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className={cn(
                                "w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none transition-all text-black font-medium placeholder:text-gray-400",
                                !isEditable && "opacity-60 cursor-not-allowed",
                                errors.clinicName ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                            )}
                            placeholder="e.g. Happy Tails Veterinary Clinic"
                        />
                        {errors.clinicName && (
                            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                                <AlertCircle size={10} /> {errors.clinicName}
                            </p>
                        )}
                    </div>

                    {/* Address Grid */}
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            Physical Address
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Door No / Flat</label>
                                <input
                                    type="text"
                                    name="address.doorNo"
                                    value={formData.address.doorNo}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("address.doorNo")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-black outline-none focus:border-blue-500",
                                        touched.address?.doorNo && errors.address?.doorNo && "border-red-500"
                                    )}
                                />
                                {touched.address?.doorNo && errors.address?.doorNo && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.doorNo}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Street / Area</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("address.street")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-black outline-none focus:border-blue-500",
                                        touched.address?.street && errors.address?.street && "border-red-500"
                                    )}
                                />
                                {touched.address?.street && errors.address?.street && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.street}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">City</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("address.city")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-black outline-none focus:border-blue-500",
                                        touched.address?.city && errors.address?.city && "border-red-500"
                                    )}
                                />
                                {touched.address?.city && errors.address?.city && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.city}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">State</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("address.state")}
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-black outline-none focus:border-blue-500",
                                        touched.address?.state && errors.address?.state && "border-red-500"
                                    )}
                                />
                                {touched.address?.state && errors.address?.state && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.state}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Pincode</label>
                                <input
                                    type="text"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("address.pincode")}
                                    maxLength={6}
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-black outline-none focus:border-blue-500",
                                        touched.address?.pincode && errors.address?.pincode && "border-red-500"
                                    )}
                                    placeholder="6 digits"
                                />
                                {touched.address?.pincode && errors.address?.pincode && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.pincode}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl text-orange-600 shadow-sm">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-orange-900">Map Accuracy</h4>
                    <p className="text-[11px] text-orange-700/80 leading-relaxed font-medium">
                        Ensure your clinic address and pincode are accurate. This information is used to help pet owners find your clinic on the map and for calculating travel distance for home visits.
                    </p>
                </div>
            </div>
        </div>
    )
}
