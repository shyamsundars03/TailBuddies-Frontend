"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useAdmin } from "../../lib/hooks/useAdmin"
// import { specialtySchema } from "../../lib/utils/validators/admin.schema"
import { specialtySchema } from "../../lib/validation/admin/admin.schema"
// import type { Specialty } from "../../types/admin.types"
import type { Specialty } from "../../lib/types/admin/admin.types"
import { cn } from "@/lib/utils/utils"
import { SearchInput } from "../common/ui/SearchInput"
import { DataTable, Column } from "../common/ui/DataTable"
import { Pagination } from "../common/ui/Pagination"
import { Dropdown } from "../common/ui/Dropdown"
import Link from "next/link"
import Swal from "sweetalert2"




interface SpecialitiesManagementProps {
    initialSpecialties?: Specialty[]
}

const INITIAL_FORM_STATE: Omit<Specialty, "id"> = {
    name: "",
    description: "",
    commonDesignation: [],
    typicalKeywords: [],
    status: "active"
}



export function SpecialitiesManagement({ initialSpecialties: _initialSpecialties = [] }: SpecialitiesManagementProps) {
    const {
        specialties,
        isLoading,
        getSpecialties,
        addSpecialty,
        editSpecialty,
        removeSpecialty,
        stats
    } = useAdmin()

    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState<Omit<Specialty, "id">>(INITIAL_FORM_STATE)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(1)

    


    const [designationInput, setDesignationInput] = useState("")
    const [keywordInput, setKeywordInput] = useState("")


    const fetchSpecialties = useCallback(async (search?: string) => {
        try {
            await getSpecialties(currentPage, 10, search)
        } catch {
        }
    }, [getSpecialties, currentPage])






    useEffect(() => {
        fetchSpecialties(searchTerm)
    }, [currentPage])





    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
            fetchSpecialties(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])





    const toggleStatus = async (id: string) => {
        const spec = specialties.find((s: Specialty) => s.id === id)
        if (!spec) return
        try {
            const newStatus = spec.status === "active" ? "inactive" : "active"
            await editSpecialty(id, { status: newStatus })


            toast.success("Specialty status updated")


        } catch {


            toast.error("Failed to update status")

        }
    }





    const handleAddTag = (type: "designation" | "keyword") => {


        if (type === "designation" && designationInput.trim()) {
            if (!formData.commonDesignation.includes(designationInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    commonDesignation: [...prev.commonDesignation, designationInput.trim()]
                }))
            }



            setDesignationInput("")


        } else if (type === "keyword" && keywordInput.trim()) {
            
            
            if (!formData.typicalKeywords.includes(keywordInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    typicalKeywords: [...prev.typicalKeywords, keywordInput.trim()]
                }))
            }


            setKeywordInput("")
        }
    }

    const removeTag = (type: "designation" | "keyword", tag: string) => {
        
        
        
        if (type === "designation") {
            setFormData(prev => ({
                ...prev,
                commonDesignation: prev.commonDesignation.filter(t => t !== tag)
            }))
        } else {


            setFormData(prev => ({
                ...prev,
                typicalKeywords: prev.typicalKeywords.filter(t => t !== tag)
            }))
        }


    }

    const handleSave = async () => {
        
        
        
        setErrors({})
        const result = specialtySchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as string] = issue.message
            })
            setErrors(fieldErrors)
            return
        }

        try {
            if (editingId) {


                await editSpecialty(editingId, formData)
                
                toast.success("Specialty updated successfully")
            } else {
                await addSpecialty(formData)
                
                
                toast.success("Specialty created successfully")
            }



            fetchSpecialties() 
            handleCloseModal()


        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            const message =
                err.response?.data?.message ||
                (editingId
                    ? "Failed to update specialty"
                    : "Failed to add specialty");

            toast.error(message);
        }
    }

    const handleEdit = (spec: Specialty) => {



        setFormData({
            name: spec.name,
            description: spec.description,
            commonDesignation: spec.commonDesignation,
            typicalKeywords: spec.typicalKeywords,
            status: spec.status
        })



        setEditingId(spec.id)


        setShowModal(true)
    }

    const handleCloseModal = () => {



        setShowModal(false)
        setEditingId(null)
        setFormData(INITIAL_FORM_STATE)
        setErrors({})
        setDesignationInput("")
        setKeywordInput("")
    }

const handleDelete = async (id: string) => {




    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        })

    
        if (result.isConfirmed) {
            await removeSpecialty(id)
            fetchSpecialties()
            
            toast.success("Specialty deleted successfully")
        } 
    }catch {
            toast.error("Failed to delete specialty")
        }
}







    const columns: Column<Specialty>[] = [
        {
            header: "Speciality Name",
            accessor: (spec) => (
                <div className="flex flex-col">
                    <span
                        onClick={() => handleEdit(spec)}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                        {spec.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">{spec.description}</span>
                </div>
            ),
            sortable: true
        },
        {
            header: "Status",
            accessor: (spec) => (
                <button
                    onClick={() => toggleStatus(spec.id)}
                    className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none",
                        spec.status === "active" ? "bg-green-500" : "bg-gray-300"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                            spec.status === "active" ? "translate-x-6" : "translate-x-1"
                        )}
                    />
                </button>
            ),
            sortable: true,
            className: "text-center"
        },
        {
            header: "Action",
            accessor: (spec) => (
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={() => handleEdit(spec)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition shadow-sm group"
                    >
                        <Edit size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => handleDelete(spec.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm group"
                    >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            ),
            className: "text-right"
        }
    ]

    return (
        <>
            <div className="bg-gray-50/50 min-h-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#333333] mb-1">Specialities Management</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                            <span>/</span>
                            <span className="text-gray-400">Specialities</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} />
                        Add Speciality
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-blue-900/80">Specialities List</h2>
                        <SearchInput
                            placeholder="Search specialities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            containerClassName="w-64"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={specialties}
                        keyExtractor={(s) => s.id}
                        isLoading={isLoading}
                        emptyMessage="No specialities found."
                        className="border-0 shadow-none rounded-none"
                    />

                    <div className="px-6 py-4 bg-gray-50/30">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(stats.totalSpecialties / 10) || 1}
                            onPageChange={setCurrentPage}
                            totalEntries={stats.totalSpecialties}
                            entriesPerPage={10}
                        />
                    </div>
                </div>
            </div>

            {/* Specialty Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingId ? "Edit Speciality" : "Add New Speciality"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Speciality Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter speciality name (e.g. Dermatologist)    "
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={cn(
                                        "w-full px-4 py-2.5 bg-gray-50  text-gray-900 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                                        errors.name ? "border-red-500 shadow-sm shadow-red-100" : "border-gray-200 focus:bg-white"
                                    )}
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <textarea
                                    placeholder="Enter descriptive details about this specialty..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className={cn(
                                        "w-full px-4 py-2.5 bg-gray-50   text-gray-900 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none",
                                        errors.description ? "border-red-500 shadow-sm shadow-red-100" : "border-gray-200 focus:bg-white"
                                    )}
                                />
                                {errors.description && <p className="text-xs text-red-500 mt-1 ml-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Common Designation */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Common Designation</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add designation..."
                                            value={designationInput}
                                            onChange={(e) => setDesignationInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleAddTag("designation")}
                                            className="flex-1 px-4 py-2 bg-gray-50   text-gray-900  border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                        <button
                                            onClick={() => handleAddTag("designation")}
                                            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition active:scale-95"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.commonDesignation.map(tag => (
                                            <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {tag}
                                                <button onClick={() => removeTag("designation", tag)} className="ml-1.5 hover:text-blue-900">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {errors.commonDesignation && <p className="text-xs text-red-500 mt-1">{errors.commonDesignation}</p>}
                                </div>

                                {/* Typical Keywords */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Typical Keywords</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add keyword..."
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleAddTag("keyword")}
                                            className="flex-1 px-4 py-2 bg-gray-50   text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                        <button
                                            onClick={() => handleAddTag("keyword")}
                                            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition active:scale-95"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.typicalKeywords.map(tag => (
                                            <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                {tag}
                                                <button onClick={() => removeTag("keyword", tag)} className="ml-1.5 hover:text-purple-900">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {errors.typicalKeywords && <p className="text-xs text-red-500 mt-1">{errors.typicalKeywords}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Speciality Status</label>
                                <Dropdown
                                    options={[
                                        { label: "Active", value: "active" },
                                        { label: "Inactive", value: "inactive" }
                                    ]}
                                    value={formData.status}
                                    onChange={(val) => setFormData(prev => ({ ...prev, status: val as "active" | "inactive" }))}
                                    className="max-w-[200px]"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-white hover:border-gray-400 transition active:scale-95 shadow-sm"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition active:scale-95 shadow-md hover:shadow-lg"
                            >
                                Save Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
