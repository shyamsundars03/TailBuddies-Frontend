"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle2 } from 'lucide-react'

export function SingleTransactionView({ id }: { id: string }) {
    const router = useRouter()

    return (
        <div className="bg-gray-50/50 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-blue-950">Transactions</h1>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/transactionManagement')}>Transactions</span>
                            <span>/</span>
                            <span className="text-gray-400 uppercase tracking-wider">TransactionID: {id}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-10 py-2 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition"
                    >
                        Back
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {/* Status Header */}
                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-50 shadow-sm">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-0.5">#Apt0001</p>
                                <p className="text-gray-900 font-black text-xs">Dr. Arun</p>
                            </div>
                        </div>
                        <div className="flex gap-12">
                            <div className="flex flex-col items-center">
                                <p className="text-blue-950 font-black text-xs mb-1">Status:</p>
                                <span className="text-gray-400 font-bold text-xs uppercase">Completed</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-blue-950 font-black text-xs mb-1">Payment Status:</p>
                                <span className="text-gray-400 font-bold text-xs uppercase">Completed</span>
                            </div>
                        </div>
                        <div className="w-24"></div> {/* Spacer for symmetry */}
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Pet Info */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-3">Pet:</h3>
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
                            <h3 className="text-sm font-black text-blue-950 mb-3">Doctor :</h3>
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
                                        <p className="text-gray-700 font-bold text-xs">₹300</p>
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

                        {/* Payments Section */}
                        <section>
                            <h3 className="text-sm font-black text-blue-950 mb-3">Payments</h3>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-6 grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Payment Method</p>
                                    <p className="text-gray-700 font-bold text-xs">Razerpay</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Doctor's Amount</p>
                                    <p className="text-gray-900 font-black text-xs">₹249</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Platform contribution 5%</p>
                                    <p className="text-gray-900 font-black text-xs">₹50</p>
                                </div>
                            </div>
                        </section>

                        {/* Refunds Section */}
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-black text-blue-950">Refunds</h3>
                                <button className="px-10 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-600 transition">
                                    Approve
                                </button>
                            </div>
                            <div className="bg-gray-50/30 rounded-xl border border-gray-100 p-6 grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Reason</p>
                                    <p className="text-gray-700 font-bold text-xs">By Misunderstanding</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Refund to</p>
                                    <p className="text-gray-700 font-bold text-xs">adrian@gmail.com</p>
                                </div>
                                <div>
                                    <p className="text-blue-900/60 font-bold text-[10px] uppercase mb-1">Refunded Amount</p>
                                    <p className="text-gray-900 font-black text-xs">₹399</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
