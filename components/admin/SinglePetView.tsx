"use client"

import React, { useState, useEffect } from 'react'
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { adminPetApi } from '../../lib/api/admin/pet.api'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import {  formatDate } from "@/lib/utils/utils"

export function SinglePetView({ id }: { id: string }) {
    const router = useRouter()
    const [pet, setPet] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchPetDetails = async () => {
        setIsLoading(true)
        const response = await adminPetApi.getPetById(id)
        if (response.success) {
            setPet(response.data)
        } else {
            toast.error(response.error || "Failed to load pet details")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (id) {
            fetchPetDetails()
        }
    }, [id])

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 font-medium">Loading pet details...</div>
    }

    if (!pet) {
        return <div className="p-12 text-center text-red-500 font-medium flex flex-col items-center gap-4">
            <AlertCircle size={48} className="text-red-300" />
            <p>Pet not found</p>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go back</button>
        </div>
    }

    return (
        <div className="bg-gray-50/50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/petsManagement')}>List of Pet</span>
                            <span>/</span>
                            <span className="text-gray-400">{pet.name} </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold hover:bg-gray-600 transition shadow-sm"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    {/* Owner Info Row */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-2xl">
                            {pet.ownerId?.profilePicture ? (
                                <img
                                    src={pet.ownerId.profilePicture}
                                    alt="Owner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                "👤"
                            )}
                        </div>
                        <div>
                            <p className="text-blue-500 text-[10px] font-bold uppercase">Owner Name</p>
                            <h3 className="text-gray-900 font-black text-sm">{pet.ownerId?.username || "N/A"}</h3>
                            <p className="text-gray-500 text-xs">{pet.ownerId?.email || "N/A"}</p>
                        </div>
                    </div>

                    {/* Pet Status Section */}
                    <div className="flex items-center gap-3 mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100 w-fit pr-8">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 shadow-sm">
                            {pet.picture ? (
                                <img
                                    src={pet.picture}
                                    alt="Pet"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                "🐕"
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-blue-900 font-black text-lg tracking-tight uppercase">{pet.name}</h4>
                            {pet.isVaccinated === "YES" && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded border border-blue-200">
                                    Vaccinated
                                </span>
                            )}
                            <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${pet.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {pet.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Pet Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <InfoBox label="Name" value={pet.name} />
                        <InfoBox label="Species" value={pet.species || "N/A"} />
                        <InfoBox label="Gender" value={pet.gender || "N/A"} />
                        <InfoBox label="DOB" value={formatDate(pet.dob)} />
                        <InfoBox label="Age" value={pet.age || "N/A"} />
                        <InfoBox label="Weight" value={pet.weight || "N/A"} />
                    </div>

                    {/* Vaccination Section */}
                    {pet.vaccinations && pet.vaccinations.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-black text-gray-900">Vaccinations:</h2>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                                <div className="grid grid-cols-4 bg-gray-50/50 p-4 border-b border-gray-100">
                                    <span className="text-blue-900/60 font-black text-[10px] uppercase">Vaccination Name</span>
                                    <span className="text-blue-900/60 font-black text-[10px] uppercase">Taken Date</span>
                                    <span className="text-blue-900/60 font-black text-[10px] uppercase">Next Due Date</span>
                                    <span className="text-blue-900/60 font-black text-[10px] uppercase">Certificates</span>
                                </div>
                                {pet.vaccinations.map((vac: any, idx: number) => (
                                    <div key={idx} className="grid grid-cols-4 p-4 hover:bg-gray-50 transition border-b last:border-0 border-gray-50">
                                        <span className="text-gray-700 font-bold text-xs">{vac.vaccinationName || vac.name || "N/A"}</span>
                                        <span className="text-gray-600 font-medium text-xs">{vac.takenDate || vac.lastTaken || "N/A"}</span>
                                        <span className="text-gray-600 font-medium text-xs">{vac.dueDate || vac.nextDue || "N/A"}</span>
                                        <span className="text-blue-600 font-bold text-xs hover:underline cursor-pointer">{vac.certificate ? "View Certificate" : "N/A"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analytics Section */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 mb-4">Analytics:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Creation Date', value: new Date(pet.createdAt).toLocaleDateString() },
                                { label: 'Last Updated', value: new Date(pet.updatedAt).toLocaleDateString() },
                                { label: 'Owner Status', value: pet.ownerId?.isBlocked ? "Blocked" : "Active" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                                    <p className="text-blue-900/60 font-black text-[10px] uppercase mb-0.5">{stat.label}</p>
                                    <p className="text-gray-700 font-bold text-xs">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
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