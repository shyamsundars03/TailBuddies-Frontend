"use client"

import { useState, useEffect, useCallback } from "react"
import { Edit2, Trash2, ShieldCheck, FileText, ChevronLeft, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { AddPetModal } from "../../../../../components/owner/AddPetModal"
import { cn, formatDate } from "@/lib/utils/utils"
import { useOwnerPets } from "@/lib/hooks/owner/useOwnerPets"
import { OWNER_ROUTES } from "@/lib/constants/routes"
import type { PetVaccination } from "@/lib/types/owner/owner.types"
import Swal from 'sweetalert2'

export default function SinglePetViewPage() {
    const params = useParams()
    const router = useRouter()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const { 
        pet, 
        isLoading, 
        isSubmitting, 
        getPetDetails, 
        togglePetStatus, 
        deletePet, 
        updatePet 
    } = useOwnerPets()

    const fetchPetData = useCallback(async () => {
        if (params.id) {
            await getPetDetails(params.id as string)
        }
    }, [params.id, getPetDetails])

    useEffect(() => {
        fetchPetData()
    }, [fetchPetData])

    const handleToggleStatus = async () => {
        if (!pet) return
        
        const action = pet.isActive ? "deactivate" : "activate"
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} ${pet.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action} it!`
        })

        if (result.isConfirmed) {
            await togglePetStatus(pet._id, pet.isActive)
        }
    }

    const handleDelete = async () => {
        if (!pet) return

        const result = await Swal.fire({
            title: 'Delete Pet?',
            text: `Are you sure you want to completely remove ${pet.name}? This action cannot be undone.`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            const success = await deletePet(pet._id)
            if (success) {
                router.push(OWNER_ROUTES.PETS)
            }
        }
    }

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 font-medium">Loading pet details...</div>
    }

    if (!pet) {
        return <div className="p-12 text-center text-red-500 font-medium flex flex-col items-center gap-4">
            <AlertCircle size={48} className="text-red-300" />
            <p>Pet not found</p>
            <Link href={OWNER_ROUTES.PETS} className="text-blue-600 hover:underline">Go back</Link>
        </div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Pets</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href={OWNER_ROUTES.PETS} className="hover:text-blue-600 transition">MY PETS</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">{pet.name}</span>
                    </nav>
                </div>
                <Link
                    href={OWNER_ROUTES.PETS}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium"
                >
                    <ChevronLeft size={20} />
                    Back to List
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md ring-4 ring-yellow-50">
                            <Image
                                src={pet.picture || "/favicon.ico"}
                                alt={pet.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-blue-950 uppercase">{pet.name}</h2>
                                {pet.vaccinated === "YES" && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                        Vaccinated
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deactivate</span>
                            <button
                                onClick={handleToggleStatus}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
                                    pet.isActive ? "bg-emerald-500" : "bg-gray-300"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                        pet.isActive ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activate</span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button onClick={() => setIsEditModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition">
                                <Edit2 size={20} />
                            </button>
                            <button onClick={handleDelete} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoBox label="Name" value={pet.name} />
                        <InfoBox label="Species" value={pet.species || "N/A"} />
                        <InfoBox label="Gender" value={pet.gender || "N/A"} />
                        <InfoBox label="DOB" value={formatDate(pet.dob)} />
                        <InfoBox label="Age" value={pet.age || "N/A"} />
                        <InfoBox label="Weight" value={pet.weight || "N/A"} />
                    </div>

                    {/* Vaccination Section */}
                    {pet.vaccinations && pet.vaccinations.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                                    <ShieldCheck className="text-blue-500" size={24} />
                                    Vaccinations:
                                </h3>
                            </div>
                            
                            <div className="grid gap-4">
                                {pet.vaccinations.map((vaccine: PetVaccination, index: number) => (
                                    <div key={index} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-8">
                                        <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Vaccination Name</p>
                                            <p className="text-blue-900 font-bold">{vaccine.vaccinationName || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Taken Date</p>
                                            <p className="text-blue-900 font-bold">{formatDate(vaccine.takenDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Next Due Date</p>
                                            <p className="text-blue-900 font-bold">{formatDate(vaccine.dueDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Certificates</p>
                                            {vaccine.certificate ? (
                                                <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition font-bold text-sm">
                                                    <FileText size={16} />
                                                    View Certificate
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm font-medium">None</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Edit Pet Modal */}
            <AddPetModal
                isOpen={isEditModalOpen}
                isSubmitting={isSubmitting}
                onClose={() => setIsEditModalOpen(false)}
                onSave={async (data, pictureFile) => {
                    const success = await updatePet(pet._id, data, pictureFile)
                    if (success) {
                        setIsEditModalOpen(false)
                        fetchPetData()
                    }
                }}
                initialData={pet} 
            />
        </div>
    )
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
            <p className="text-blue-900 font-bold text-lg">{value}</p>
        </div>
    )
}

