"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
// import { MoreHorizontal, FileText, CheckCircle2 } from 'lucide-react'

export function SingleAppointmentView({ id }: { id: string }) {
    const router = useRouter()

    return (
        <div className="bg-gray-50/50 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-blue-950">Appointments</h1>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/appointmentManagement')}>Appointments</span>
                            <span>/</span>
                            <span className="text-gray-400 uppercase">APT-ID: {id}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-8 py-2 bg-yellow-400 text-gray-900 rounded-lg text-xs font-black shadow-sm hover:bg-yellow-500 transition">
                            Edit
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="px-8 py-2 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {/* Status Header */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150&h=150" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-0.5">#Apt0001</p>
                                <p className="text-gray-900 font-black text-xs">Dr. Arun</p>
                            </div>
                            <div className="ml-8 flex items-center gap-2">
                                <span className="text-blue-950 font-black text-xs">Status:</span>
                                <span className="text-gray-400 font-bold text-xs">Completed</span>
                            </div>
                        </div>
                        <button className="px-8 py-1.5 bg-yellow-400 text-gray-900 rounded-lg text-xs font-black shadow-sm">
                            Paid
                        </button>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Pet Info */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Pet:</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 grid grid-cols-3 p-4 gap-6">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Pet Name</p>
                                    <p className="text-gray-700 font-bold text-xs">Bruno</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Species</p>
                                    <p className="text-gray-700 font-bold text-xs">Dog</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Breed</p>
                                    <p className="text-gray-700 font-bold text-xs">Golden Retriever</p>
                                </div>
                            </div>
                        </section>

                        {/* Doctor Info */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Doctor :</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-6 space-y-6">
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Doctor Name</p>
                                        <p className="text-gray-700 font-bold text-xs">Dr. Arun</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Specialization</p>
                                        <p className="text-gray-700 font-bold text-xs">Dermatology</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Experience</p>
                                        <p className="text-gray-700 font-bold text-xs">8 years</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Consultation Fee</p>
                                        <p className="text-gray-700 font-bold text-xs">300</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Service Type</p>
                                        <p className="text-gray-700 font-bold text-xs">Normal</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Mode</p>
                                        <p className="text-gray-700 font-bold text-xs">Online</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Date</p>
                                        <p className="text-gray-700 font-bold text-xs">11 Nov 2025</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Time</p>
                                        <p className="text-gray-700 font-bold text-xs">10:45 AM</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Problem & Symptoms */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Problem & symptoms</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-4 space-y-4">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Problem Description</p>
                                    <p className="text-gray-700 font-medium text-xs leading-relaxed">My dog is scratching a lot and has red patches on skin.</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Symptoms Selected</p>
                                    <p className="text-gray-700 font-bold text-xs">Itching, Redness, Hairloss</p>
                                </div>
                            </div>
                        </section>

                        {/* Timeline */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Appointment TimeLine</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-4 grid grid-cols-3 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Booked At</p>
                                    <p className="text-gray-700 font-bold text-xs">10 Nov 2024 - 8:30 PM</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Owner Check-In</p>
                                    <p className="text-gray-700 font-bold text-xs">10:30 AM - 11:00 AM</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Vet Check-In</p>
                                    <p className="text-gray-700 font-bold text-xs">10:33 AM - 11:00 AM</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Delay Status</p>
                                    <p className="text-gray-700 font-bold text-xs">Slight Delay (3 mins)</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Consultation Ended</p>
                                    <p className="text-gray-700 font-bold text-xs">11:00 AM</p>
                                </div>
                            </div>
                        </section>

                        {/* Report Section */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Report</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-6 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Clinical Findings:</p>
                                    <p className="text-gray-700 font-medium text-xs">Fungal infection observed around neck and belly.</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Diagnosis:</p>
                                    <p className="text-gray-700 font-medium text-xs">Dermatitis due to fungal infection.</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Vet Notes:</p>
                                    <p className="text-gray-700 font-medium text-xs">Apply antifungal ointment twice daily. Avoid wet areas.</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Recommended Tests:</p>
                                    <p className="text-gray-700 font-black text-xs">None</p>
                                </div>
                            </div>
                        </section>

                        {/* Prescription Section */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Prescription</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 overflow-hidden">
                                <div className="grid grid-cols-4 p-4 border-b border-gray-100 bg-gray-50/50">
                                    <span className="text-blue-900/60 font-bold text-[10px] uppercase">Medicine</span>
                                    <span className="text-blue-900/60 font-bold text-[10px] uppercase">Dosage</span>
                                    <span className="text-blue-900/60 font-bold text-[10px] uppercase">Frequency</span>
                                    <span className="text-blue-900/60 font-bold text-[10px] uppercase">Duration</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[
                                        { m: 'Keto Shampoo', d: 'External use', f: '2 times/week', t: '3 weeks' },
                                        { m: 'Antifungal Tab', d: '1 tablet', f: 'Once daily', t: '5 days' }
                                    ].map((p, idx) => (
                                        <div key={idx} className="grid grid-cols-4 p-4 items-center">
                                            <span className="text-gray-700 font-bold text-xs">{p.m}</span>
                                            <span className="text-gray-500 font-medium text-xs">{p.d}</span>
                                            <span className="text-gray-500 font-medium text-xs">{p.f}</span>
                                            <span className="text-gray-700 font-bold text-xs">{p.t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-4">Payment</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-6 grid grid-cols-4 gap-6">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Consultation Fee</p>
                                    <p className="text-gray-900 font-black text-xs">₹300</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Payment Method</p>
                                    <p className="text-gray-700 font-bold text-xs">UPI (Razorpay)</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Payment Status</p>
                                    <p className="text-green-600 font-black text-xs">Successful</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Transaction ID</p>
                                    <p className="text-gray-700 font-bold text-xs italic">TXN-RP-882341</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
