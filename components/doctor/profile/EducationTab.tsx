"use client"

import React, { useState, useEffect } from 'react'
import { doctorApi } from '../../../lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { Plus, Trash2, FileText, Calendar, GraduationCap, X, AlertCircle, Pencil } from 'lucide-react'
import Swal from 'sweetalert2'
import { educationSchema } from '../../../lib/validation/doctor/doctor.schema'
import { cn } from '@/lib/utils/utils'

interface EducationTabProps {
    doctor: any;
    onUpdate?: (data: any) => void;
    isEditable?: boolean;
}

export const EducationTab = ({ doctor, onUpdate, isEditable = true }: EducationTabProps) => {
    const [education, setEducation] = useState<any[]>(doctor?.education || [])
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [formData, setFormData] = useState({
        degree: "",
        institute: "",
        startDate: "",
        endDate: "",
        educationFile: ""
    })
    const [uploading, setUploading] = useState(false)

    // Sort function for education
    const sortEducation = (data: any[]) => {
        return [...data].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    useEffect(() => {
        if (doctor?.education) {
            setEducation(sortEducation(doctor.education))
        }
    }, [doctor])

    const validateField = (name: string, value: any) => {
        const result = educationSchema.safeParse({ ...formData, [name]: value })
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
            setFormData(prev => ({ ...prev, educationFile: response.data.url }))
            toast.success("Document uploaded successfully")
        } else {
            toast.error(response.error || "Upload failed")
        }
        setUploading(false)
    }

    const handleAdd = async () => {
        setTouched({
            degree: true,
            institute: true,
            startDate: true,
            endDate: true
        })

        const result = educationSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as string] = issue.message
            })
            setErrors(fieldErrors)
            toast.error("Please fix the errors before adding")
            return
        }

        let newEducation;
        if (editIndex !== null) {
            newEducation = [...education];
            newEducation[editIndex] = formData;
        } else {
            newEducation = [...education, formData]
        }
        
        const sortedEducation = sortEducation(newEducation);
        const response = await doctorApi.updateProfile({ education: sortedEducation })
        
        if (response.success) {
            setEducation(sortedEducation)
            if (onUpdate) onUpdate(response.data)
            setShowModal(false)
            setEditIndex(null)
            setFormData({ degree: "", institute: "", startDate: "", endDate: "", educationFile: "" })
            setTouched({})
            setErrors({})
            toast.success(editIndex !== null ? "Education record updated successfully" : "Education record added successfully")
        } else {
            toast.error(response.error || "Failed to update profile")
        }
    }

    const handleEdit = (index: number) => {
        const item = education[index];
        setFormData({
            degree: item.degree,
            institute: item.institute,
            startDate: item.startDate.split('T')[0],
            endDate: item.endDate.split('T')[0],
            educationFile: item.educationFile || ""
        });
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (index: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this education record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        })

        if (result.isConfirmed) {
            const newEducation = education.filter((_, i) => i !== index)
            const response = await doctorApi.updateProfile({ education: newEducation })
            if (response.success) {
                setEducation(newEducation)
                if (onUpdate) onUpdate(response.data)
                toast.success("Education deleted")
            } else {
                toast.error("Failed to delete")
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Education Details</h3>
                    <p className="text-sm text-gray-500">Add your academic qualifications</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={18} /> Add Education
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5">
                {education.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <div className="p-4 bg-white rounded-2xl w-fit mx-auto mb-4 shadow-sm">
                            <GraduationCap className="text-gray-300" size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">No education records yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add your degrees and qualifications here</p>
                    </div>
                ) : (
                    education.map((edu, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
                            <div className="flex gap-5">
                                <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 h-fit">
                                    <GraduationCap size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                                    <p className="text-sm font-bold text-purple-600">{edu.institute}</p>
                                    <div className="flex items-center gap-5 text-xs text-gray-500 font-bold mt-2">
                                        <span className="flex items-center gap-1.5 py-1 px-3 bg-gray-50 rounded-full">
                                            <Calendar size={14} className="text-gray-400" /> 
                                            {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                        </span>
                                        {edu.educationFile && (
                                            <a href={edu.educationFile} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline decoration-2">
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
                                <h3 className="font-bold text-gray-900 text-lg">{editIndex !== null ? "Edit Qualification" : "Add Qualification"}</h3>
                                <p className="text-xs text-gray-500 font-medium">{editIndex !== null ? "Update your academic details" : "Enter your graduation or certification details"}</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ degree: "", institute: "", startDate: "", endDate: "", educationFile: "" }); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Degree / Qualification *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MVSc in Animal Nutrition"
                                        value={formData.degree}
                                        onBlur={() => handleBlur("degree")}
                                        onChange={(e) => {
                                            setFormData({ ...formData, degree: e.target.value });
                                            if (touched.degree) validateField("degree", e.target.value);
                                        }}
                                        className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium placeholder:text-gray-400", touched.degree && errors.degree ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500")}
                                    />
                                    {touched.degree && errors.degree && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.degree}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Institute / University *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Kerala Veterinary University"
                                        value={formData.institute}
                                        onBlur={() => handleBlur("institute")}
                                        onChange={(e) => {
                                            setFormData({ ...formData, institute: e.target.value });
                                            if (touched.institute) validateField("institute", e.target.value);
                                        }}
                                        className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium placeholder:text-gray-400", touched.institute && errors.institute ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500")}
                                    />
                                    {touched.institute && errors.institute && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.institute}</p>}
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
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">End Date *</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onBlur={() => handleBlur("endDate")}
                                            onChange={(e) => {
                                                setFormData({ ...formData, endDate: e.target.value });
                                                if (touched.endDate) validateField("endDate", e.target.value);
                                            }}
                                            className={cn("w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all text-black font-medium", touched.endDate && errors.endDate ? "border-red-500" : "border-gray-200 focus:border-blue-500")}
                                        />
                                        {touched.endDate && errors.endDate && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.endDate}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Education Proof (PDF)</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="edu-file"
                                        />
                                        <label
                                            htmlFor="edu-file"
                                            className="flex-1 px-5 py-3 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-xs font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all"
                                        >
                                            <FileText size={18} className="text-blue-600" /> 
                                            {uploading ? "Uploading..." : formData.educationFile ? "Degree Attached ✓" : "Upload Certificate (Optional)"}
                                        </label>
                                    </div>
                                    {formData.educationFile && <p className="text-[10px] text-green-600 font-bold text-center">Certificate uploaded successfully</p>}
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => { setShowModal(false); setEditIndex(null); setFormData({ degree: "", institute: "", startDate: "", endDate: "", educationFile: "" }); }} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition">Cancel</button>
                            <button onClick={handleAdd} className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">{editIndex !== null ? "Update Record" : "Add Record"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
