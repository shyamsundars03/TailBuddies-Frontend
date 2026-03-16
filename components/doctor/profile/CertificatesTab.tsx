"use client"

import React, { useState, useEffect } from 'react'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { Plus, Trash2, FileText, Award, X, Upload, Pencil } from 'lucide-react'
import Swal from 'sweetalert2'
import { cn } from '@/lib/utils/utils'

interface CertificatesTabProps {
    doctor: any;
    onUpdate?: (data: any) => void;
    isEditable?: boolean;
}

export const CertificatesTab = ({ doctor, onUpdate, isEditable = true }: CertificatesTabProps) => {
    const [certificates, setCertificates] = useState<any[]>(doctor?.certificates || [])
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        certificateName: "",
        issuedBy: "",
        certificateFile: "",
        issuedYear: ""
    })
    const [uploading, setUploading] = useState(false)
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Sort function for certificates
    const sortCertificates = (data: any[]) => {
        return [...data].sort((a, b) => Number(b.issuedYear) - Number(a.issuedYear));
    }

    useEffect(() => {
        if (doctor?.certificates) {
            setCertificates(sortCertificates(doctor.certificates))
        }
    }, [doctor])

    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors }
        if (!value && name !== 'certificateFile') {
            newErrors[name] = "Required"
        } else if (name === 'issuedYear' && value && !/^\d{4}$/.test(value)) {
            newErrors[name] = "Invalid year"
        } else {
            delete newErrors[name]
        }
        setErrors(newErrors)
    }

    const handleBlur = (name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }))
        validateField(name, (formData as any)[name])
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const response = await doctorApi.uploadDocument(file)
        if (response.success) {
            setFormData(prev => ({ ...prev, certificateFile: response.data.url }))
            setErrors(prev => { const n = { ...prev }; delete n.certificateFile; return n; })
            toast.success("Certificate uploaded")
        } else {
            toast.error(response.error || "Upload failed")
        }
        setUploading(false)
    }

    const handleAdd = async () => {
        setTouched({
            certificateName: true,
            issuedBy: true,
            issuedYear: true,
            certificateFile: true
        })

        if (!formData.certificateName || !formData.certificateFile || !formData.issuedBy || !formData.issuedYear) {
            const newErrors: any = {}
            if (!formData.certificateName) newErrors.certificateName = "Required"
            if (!formData.issuedBy) newErrors.issuedBy = "Required"
            if (!formData.issuedYear) newErrors.issuedYear = "Required"
            if (!formData.certificateFile) newErrors.certificateFile = "Required"
            setErrors(newErrors)
            toast.error("Please fill all required fields")
            return
        }

        if (errors.issuedYear) return toast.error("Please fix errors")

        let newCertificates;
        if (editIndex !== null) {
            newCertificates = [...certificates];
            newCertificates[editIndex] = formData;
        } else {
            newCertificates = [...certificates, formData]
        }
        
        const sortedCertificates = sortCertificates(newCertificates);
        const response = await doctorApi.updateProfile({ certificates: sortedCertificates })
        
        if (response.success) {
            setCertificates(sortedCertificates)
            if (onUpdate) onUpdate(response.data)
            setShowModal(false)
            setEditIndex(null)
            setFormData({ certificateName: "", issuedBy: "", certificateFile: "", issuedYear: "" })
            setTouched({})
            setErrors({})
            toast.success(editIndex !== null ? "Certificate updated" : "Certificate added")
        } else {
            toast.error(response.error || "Failed to update profile")
        }
    }

    const handleEdit = (index: number) => {
        const item = certificates[index];
        setFormData({
            certificateName: item.certificateName,
            issuedBy: item.issuedBy,
            certificateFile: item.certificateFile,
            issuedYear: item.issuedYear
        });
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (index: number) => {
        const result = await Swal.fire({
            title: "Remove Certificate?",
            text: "This will permanently remove this certificate from your profile.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it"
        })

        if (result.isConfirmed) {
            const newCertificates = certificates.filter((_, i) => i !== index)
            const response = await doctorApi.updateProfile({ certificates: newCertificates })
            if (response.success) {
                setCertificates(newCertificates)
                if (onUpdate) onUpdate(response.data)
                toast.success("Certificate removed")
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Additional Certificates</h3>
                    <p className="text-sm text-gray-500">Add workshops, seminars, or specialized training certificates</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={18} /> Add Certificate
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certificates.length === 0 ? (
                    <div className="sm:col-span-2 text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <Award className="text-gray-300 mx-auto mb-4" size={48} />
                        <p className="text-sm font-bold text-gray-900">No additional certificates</p>
                        <p className="text-xs text-gray-400 mt-1">Showcase your extra achievements here</p>
                    </div>
                ) : (
                    certificates.map((cert, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-gray-900 truncate text-sm">{cert.certificateName}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-500 font-medium">{cert.issuedBy} • {cert.issuedYear}</span>
                                        <span className="text-gray-300">•</span>
                                        <a href={cert.certificateFile} target="_blank" className="text-[10px] text-blue-600 font-bold hover:underline">View Document</a>
                                    </div>
                                </div>
                            </div>
                            {isEditable && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(idx)}
                                        className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">{editIndex !== null ? "Edit Certificate" : "New Certificate"}</h3>
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ certificateName: "", issuedBy: "", certificateFile: "", issuedYear: "" }); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Certificate Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Advanced Orthopedic Surgery Workshop"
                                    value={formData.certificateName}
                                    onBlur={() => handleBlur("certificateName")}
                                    onChange={(e) => {
                                        setFormData({ ...formData, certificateName: e.target.value });
                                        if (touched.certificateName) validateField("certificateName", e.target.value);
                                    }}
                                    className={cn(
                                        "w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm text-black outline-none font-medium placeholder:text-gray-400 focus:border-blue-500",
                                        touched.certificateName && errors.certificateName ? "border-red-500" : "border-gray-200"
                                    )}
                                />
                                {touched.certificateName && errors.certificateName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.certificateName}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Issued By</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Veterinary Council"
                                        value={formData.issuedBy}
                                        onBlur={() => handleBlur("issuedBy")}
                                        onChange={(e) => {
                                            setFormData({ ...formData, issuedBy: e.target.value });
                                            if (touched.issuedBy) validateField("issuedBy", e.target.value);
                                        }}
                                        className={cn(
                                            "w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm text-black outline-none font-medium placeholder:text-gray-400 focus:border-blue-500",
                                            touched.issuedBy && errors.issuedBy ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {touched.issuedBy && errors.issuedBy && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.issuedBy}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Issued Year</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2023"
                                        maxLength={4}
                                        value={formData.issuedYear}
                                        onBlur={() => handleBlur("issuedYear")}
                                        onChange={(e) => {
                                            setFormData({ ...formData, issuedYear: e.target.value });
                                            if (touched.issuedYear) validateField("issuedYear", e.target.value);
                                        }}
                                        className={cn(
                                            "w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm text-black outline-none font-medium placeholder:text-gray-400 focus:border-blue-500",
                                            touched.issuedYear && errors.issuedYear ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {touched.issuedYear && errors.issuedYear && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.issuedYear}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Upload Document (PDF/Image)</label>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="cert-file"
                                />
                                <label
                                    htmlFor="cert-file"
                                    className={cn(
                                        "w-full h-32 bg-white border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-all group",
                                        touched.certificateFile && errors.certificateFile ? "border-red-300 bg-red-50/10" : "border-gray-200 hover:border-blue-200"
                                    )}
                                >
                                    <div className="p-3 bg-gray-50 rounded-full group-hover:scale-110 transition-transform">
                                        <Upload size={24} className={cn(touched.certificateFile && errors.certificateFile ? "text-red-500" : "text-blue-600")} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{uploading ? "Uploading..." : formData.certificateFile ? "Document Attached ✓" : "Choose File"}</span>
                                    <span className="text-[10px] text-gray-400">PDF, JPG or PNG (Max 10MB)</span>
                                </label>
                                {touched.certificateFile && errors.certificateFile && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.certificateFile}</p>}
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ certificateName: "", issuedBy: "", certificateFile: "", issuedYear: "" }); }} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition">Cancel</button>
                            <button onClick={handleAdd} className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">{editIndex !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
