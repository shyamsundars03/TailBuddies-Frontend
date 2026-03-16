"use client"

import { useState } from "react"
import { Edit2, Trash2, Calendar, ShieldCheck, FileText, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils/utils"

// Dummy data for a single pet based on Image 3
const DUMMY_PET_DETAIL = {
    id: "1",
    name: "MAX",
    species: "Golden Retriever",
    gender: "Male",
    dob: "21 March 2021",
    age: "1 Year 8 Months",
    weight: "28 Kg",
    vaccinated: true,
    status: "active",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300&h=300",
    vaccination: {
        name: "Rabbies",
        lastTaken: "2024-01-10",
        nextDue: "2025-01-10",
        certificate: "Rabbies.pdf"
    },
    others: {
        subscription: "Active",
        upcomingAppointments: 2,
        totalConsultations: 7
    }
}

export default function SinglePetViewPage() {
    const params = useParams()
    const [pet, setPet] = useState(DUMMY_PET_DETAIL)

    const toggleStatus = () => {
        setPet(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Pets</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/pets" className="hover:text-blue-600 transition">MY PETS</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">petId: {params.id}</span>
                    </nav>
                </div>
                <Link
                    href="/owner/pets"
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
                                src={pet.image}
                                alt={pet.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-blue-950 uppercase">{pet.name}</h2>
                                {pet.vaccinated && (
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
                                onClick={toggleStatus}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
                                    pet.status === 'active' ? "bg-emerald-500" : "bg-gray-300"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                        pet.status === 'active' ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activate</span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition">
                                <Edit2 size={20} />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoBox label="Name" value={pet.name} />
                        <InfoBox label="Species" value={pet.species} />
                        <InfoBox label="Gender" value={pet.gender} />
                        <InfoBox label="DOB" value={pet.dob} />
                        <InfoBox label="Age" value={pet.age} />
                        <InfoBox label="Weight" value={pet.weight} />
                    </div>

                    {/* Vaccination Section */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                            <ShieldCheck className="text-blue-500" size={24} />
                            Vaccination:
                        </h3>
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">Vaccination Name</p>
                                <p className="text-blue-900 font-bold">{pet.vaccination.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">LateTakenDate</p>
                                <p className="text-blue-900 font-bold">{pet.vaccination.lastTaken}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">NextDueDate</p>
                                <p className="text-blue-900 font-bold">{pet.vaccination.nextDue}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">Certificates</p>
                                <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition font-bold text-sm">
                                    <FileText size={16} />
                                    {pet.vaccination.certificate}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Others Section */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-blue-950 uppercase tracking-tight">Others:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoBox label="Subscription" value={pet.others.subscription} />
                            <InfoBox label="Up Coming Appointments" value={String(pet.others.upcomingAppointments)} />
                            <InfoBox label="Total Consultations" value={String(pet.others.totalConsultations)} />
                        </div>
                    </section>
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
