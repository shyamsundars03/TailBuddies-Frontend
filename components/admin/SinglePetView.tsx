"use client"

import React from 'react'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Vaccination {
    name: string
    lastDate: string
    nextDate: string
    certificate: string
}

const DUMMY_VACCINATIONS: Vaccination[] = [
    {
        name: 'Rabbies',
        lastDate: '2024-01-10',
        nextDate: '2025-01-10',
        certificate: 'Rabbies.pdf'
    }
]

export function SinglePetView({ id }: { id: string }) {
    const router = useRouter()

    return (
        <div className="bg-gray-50/50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">List of Pet</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/petsManagement')}>List of Pet</span>
                            <span>/</span>
                            <span className="text-gray-400">Pet-ID: {id}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold hover:bg-gray-600 transition shadow-sm">
                            Verify
                        </button>
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
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"
                                alt="Owner"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-blue-500 text-[10px] font-bold uppercase">Owner Name</p>
                            <h3 className="text-gray-900 font-black text-sm">Hendrika</h3>
                        </div>
                    </div>

                    {/* Pet Status Section */}
                    <div className="flex items-center gap-3 mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100 w-fit pr-8">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                            <img
                                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150&h=150"
                                alt="Pet"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-blue-900 font-black text-lg tracking-tight">Vaccinated</h4>
                        </div>
                    </div>

                    {/* Pet Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Name', value: 'Max' },
                            { label: 'Species', value: 'Golder Retriver' },
                            { label: 'Gender', value: 'Male' },
                            { label: 'DOB', value: '21 March 2021' },
                            { label: 'Age', value: '1 Year 8 Months' },
                            { label: 'Weight', value: '28 Kg' },
                        ].map((detail, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                                <p className="text-blue-900/60 font-black text-[10px] uppercase mb-0.5">{detail.label}</p>
                                <p className="text-gray-700 font-bold text-xs">{detail.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Vaccination Section */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900">Vaccination:</h2>
                            <button className="px-6 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition">
                                Verify
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                            <div className="grid grid-cols-4 bg-gray-50/50 p-4 border-b border-gray-100">
                                <span className="text-blue-900/60 font-black text-[10px] uppercase">Vaccination Name</span>
                                <span className="text-blue-900/60 font-black text-[10px] uppercase">LateTakenDate</span>
                                <span className="text-blue-900/60 font-black text-[10px] uppercase">NextDueDate</span>
                                <span className="text-blue-900/60 font-black text-[10px] uppercase">Certificates</span>
                            </div>
                            {DUMMY_VACCINATIONS.map((vac, idx) => (
                                <div key={idx} className="grid grid-cols-4 p-4 hover:bg-gray-50 transition border-b last:border-0 border-gray-50">
                                    <span className="text-gray-700 font-bold text-xs">{vac.name}</span>
                                    <span className="text-gray-600 font-medium text-xs">{vac.lastDate}</span>
                                    <span className="text-gray-600 font-medium text-xs">{vac.nextDate}</span>
                                    <span className="text-blue-600 font-bold text-xs hover:underline cursor-pointer">{vac.certificate}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Others Section */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 mb-4">Others:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Subcription', value: 'Active' },
                                { label: 'Up Coming Appointments', value: '2' },
                                { label: 'Total Consultations', value: '7' },
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
