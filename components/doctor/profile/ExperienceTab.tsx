"use client"

import React, { useState, useEffect } from 'react'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { Plus, Trash2, FileText, Calendar, Briefcase, X, AlertCircle, Pencil } from 'lucide-react'
import Swal from 'sweetalert2'
import { experienceSchema } from '../../../lib/validation/doctor/doctor.schema'
import { cn } from '@/lib/utils/utils'

interface ExperienceTabProps {
    doctor: any;
    onUpdate?: (data: any) => void;
    isEditable?: boolean;
}

export const ExperienceTab = ({ doctor, onUpdate, isEditable = true }: ExperienceTabProps) => {
    const [experience, setExperience] = useState<any[]>(doctor?.experience || [])
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [formData, setFormData] = useState({
        role: "",
        organization: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        experienceFile: ""
    })
    const [uploading, setUploading] = useState(false)

    // Sort function for experience
    const sortExperience = (data: any[]) => {
        return [...data].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    useEffect(() => {
        if (doctor?.experience) {
            setExperience(sortExperience(doctor.experience))
        }
    }, [doctor])

    const validateField = (name: string, value: any) => {
        const validationData = {
            ...formData,
            [name]: value,
            endDate: (name === 'isCurrent' ? value : formData.isCurrent) ? undefined : (name === 'endDate' ? value : formData.endDate)
        }
        const result = experienceSchema.safeParse(validationData)
        const newErrors = { ...errors }

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as string] = issue.message
            })
            
            if (fieldErrors[name]) {
                newErrors[name] = fieldErrors[name]
            } else {
                delete newErrors[name]
            }

            // Cross-field validation for dates
            if (name === 'startDate' || name === 'endDate') {
                if (fieldErrors.endDate) newErrors.endDate = fieldErrors.endDate
                else delete newErrors.endDate
            }
        } else {
            delete newErrors[name]
            if (name === 'startDate' || name === 'endDate') delete newErrors.endDate
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

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size should be less than 10MB")
            return
        }

        setUploading(true)
        const response = await doctorApi.uploadDocument(file)
        if (response.success) {
            setFormData(prev => ({ ...prev, experienceFile: response.data.url }))
            toast.success("Document uploaded successfully")
        } else {
            toast.error(response.error || "Upload failed")
        }
        setUploading(false)
    }

    const handleAdd = async () => {
        setTouched({
            role: true,
            organization: true,
            startDate: true,
            endDate: true
        })

        const validationData = {
            ...formData,
            endDate: formData.isCurrent ? undefined : formData.endDate
        }
        const result = experienceSchema.safeParse(validationData)

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as string] = issue.message
            })
            setErrors(fieldErrors)
            toast.error("Please fix the errors before adding")
            return
        }

        let newExperience;
        if (editIndex !== null) {
            newExperience = [...experience];
            newExperience[editIndex] = validationData;
        } else {
            newExperience = [...experience, validationData]
        }
        
        const sortedExperience = sortExperience(newExperience);
        const response = await doctorApi.updateProfile({ experience: sortedExperience })
        
        if (response.success) {
            setExperience(sortedExperience)
            if (onUpdate) onUpdate(response.data)
            setShowModal(false)
            setEditIndex(null)
            setFormData({ role: "", organization: "", startDate: "", endDate: "", isCurrent: false, experienceFile: "" })
            setTouched({})
            setErrors({})
            toast.success(editIndex !== null ? "Experience updated successfully" : "Experience added successfully")
        } else {
            toast.error(response.error || "Failed to update profile")
        }
    }

    const handleEdit = (index: number) => {
        const item = experience[index];
        setFormData({
            role: item.role,
            organization: item.organization,
            startDate: item.startDate.split('T')[0],
            endDate: item.endDate ? item.endDate.split('T')[0] : "",
            isCurrent: item.isCurrent,
            experienceFile: item.experienceFile || ""
        });
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (index: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this experience record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        })

        if (result.isConfirmed) {
            const newExperience = experience.filter((_, i) => i !== index)
            const response = await doctorApi.updateProfile({ experience: newExperience })
            if (response.success) {
                setExperience(newExperience)
                if (onUpdate) onUpdate(response.data)
                toast.success("Experience deleted")
            } else {
                toast.error("Failed to delete")
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Professional Experience</h3>
                    <p className="text-sm text-gray-500">Add or manage your work history</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={18} /> Add Experience
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5">
                {experience.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <div className="p-4 bg-white rounded-2xl w-fit mx-auto mb-4 shadow-sm">
                            <Briefcase className="text-gray-300" size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">No experience records yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click the button above to add your first record</p>
                    </div>
                ) : (
                    experience.map((exp, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
                            <div className="flex gap-5">
                                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 h-fit">
                                    <Briefcase size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                                    <p className="text-sm font-bold text-blue-600">{exp.organization}</p>
                                    <div className="flex items-center gap-5 text-xs text-gray-500 font-bold mt-2">
                                        <span className="flex items-center gap-1.5 py-1 px-3 bg-gray-50 rounded-full">
                                            <Calendar size={14} className="text-gray-400" /> 
                                            {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.isCurrent ? "Present" : new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                        </span>
                                        {exp.experienceFile && (
                                            <a href={exp.experienceFile} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline decoration-2">
                                                <FileText size={14} /> View Certificate
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isEditable && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(idx)}
                                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={20} />
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
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{editIndex !== null ? "Edit Work Experience" : "Add Work Experience"}</h3>
                                <p className="text-xs text-gray-500 font-medium">{editIndex !== null ? "Update details about your experience" : "Add details about your previous/current role"}</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ role: "", organization: "", startDate: "", endDate: "", isCurrent: false, experienceFile: "" }); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Role / Designation *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Senior Veterinary Surgeon"
                                            value={formData.role}
                                            onBlur={() => handleBlur("role")}
                                            onChange={(e) => {
                                                setFormData({ ...formData, role: e.target.value });
                                                if (touched.role) validateField("role", e.target.value);
                                            }}
                                            className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium placeholder:text-gray-400", touched.role && errors.role ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500")}
                                        />
                                        {touched.role && errors.role && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.role}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Organization / Clinic *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. City Animal Hospital"
                                            value={formData.organization}
                                            onBlur={() => handleBlur("organization")}
                                            onChange={(e) => {
                                                setFormData({ ...formData, organization: e.target.value });
                                                if (touched.organization) validateField("organization", e.target.value);
                                            }}
                                            className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium placeholder:text-gray-400", touched.organization && errors.organization ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500")}
                                        />
                                        {touched.organization && errors.organization && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.organization}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Start Date *</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onBlur={() => handleBlur("startDate")}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, startDate: e.target.value });
                                                    if (touched.startDate) validateField("startDate", e.target.value);
                                                }}
                                                className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium", touched.startDate && errors.startDate ? "border-red-500" : "border-gray-200 focus:border-blue-500")}
                                            />
                                            {touched.startDate && errors.startDate && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.startDate}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                disabled={formData.isCurrent}
                                                onBlur={() => handleBlur("endDate")}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, endDate: e.target.value });
                                                    if (touched.endDate) validateField("endDate", e.target.value);
                                                }}
                                                className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium", !formData.isCurrent && touched.endDate && errors.endDate ? "border-red-500" : "border-gray-200 focus:border-blue-500", formData.isCurrent && "opacity-40 cursor-not-allowed")}
                                            />
                                            {!formData.isCurrent && touched.endDate && errors.endDate && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.endDate}</p>}
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <input
                                            type="checkbox"
                                            checked={formData.isCurrent}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData({ ...formData, isCurrent: checked });
                                                validateField("isCurrent", checked);
                                            }}
                                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                        />
                                        <span className="text-sm text-gray-700 font-bold group-hover:text-blue-600 transition-colors">I am currently working here</span>
                                    </label>
                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Experience Proof (PDF)</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="exp-file"
                                        />
                                        <label
                                            htmlFor="exp-file"
                                            className="flex-1 px-5 py-3 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-xs font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all"
                                        >
                                            <FileText size={18} className="text-blue-600" /> 
                                            {uploading ? "Uploading..." : formData.experienceFile ? "Document Attached ✓" : "Upload Letter (Optional)"}
                                        </label>
                                    </div>
                                    {formData.experienceFile && <p className="text-[10px] text-green-600 font-bold text-center">Certificate uploaded successfully</p>}
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ role: "", organization: "", startDate: "", endDate: "", isCurrent: false, experienceFile: "" }); }} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition">Cancel</button>
                            <button onClick={handleAdd} className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">{editIndex !== null ? "Update Record" : "Add Record"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
