"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle2 } from 'lucide-react'

export function SingleTransactionView({ id }: { id: string }) {
    const router = useRouter()

    return (
        <div className="space-y-8 font-inter">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333] mb-1">Transactions</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                        <span>/</span>
                        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push('/admin/transactionManagement')}>Transactions</span>
                        <span>/</span>
                        <span className="text-gray-400 uppercase tracking-wider">TransactionID: {id}</span>
                    </div>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-8 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                    Back
                </button>
            </div>

            {/* Main Content Area */}
            <div className="space-y-10">
                {/* Status Header Strip */}
                <div className="flex flex-wrap items-center gap-12 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-gray-100 p-1">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Doctor" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">#Apt0001</p>
                            <p className="text-sm font-black text-gray-600">Dr. Arun</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#002B49]">Status:</span>
                        <span className="text-sm font-bold text-gray-500">Completed</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#002B49]">Payment Status:</span>
                        <span className="text-sm font-bold text-gray-500">Completed</span>
                    </div>
                </div>

                {/* Pet Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-[#002B49]">Pet:</h2>
                    <div className="bg-gray-50/30 border border-gray-50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Pet Name</p>
                            <p className="text-sm font-black text-gray-600">Bruno</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Species</p>
                            <p className="text-sm font-black text-gray-600">Dog</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Breed</p>
                            <p className="text-sm font-black text-gray-600">Golden Retriever</p>
                        </div>
                    </div>
                </div>

                {/* Doctor Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-[#002B49]">Doctor :</h2>
                    <div className="bg-gray-50/30 border border-gray-50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Doctor Name</p>
                            <p className="text-sm font-black text-gray-600">Dr. Arun</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Specialization</p>
                            <p className="text-sm font-black text-gray-600">Dermatology</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Experience</p>
                            <p className="text-sm font-black text-gray-600">8 years</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Consultation Fee</p>
                            <p className="text-sm font-black text-gray-600">₹300</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Service Type</p>
                            <p className="text-sm font-black text-gray-600">Normal</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mode</p>
                            <p className="text-sm font-black text-gray-600">Online</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Date</p>
                            <p className="text-sm font-black text-gray-600">11 Nov 2025</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Time</p>
                            <p className="text-sm font-black text-gray-600">10.45 AM</p>
                        </div>
                    </div>
                </div>

                {/* Payments Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-[#002B49]">Payments</h2>
                    <div className="bg-gray-50/30 border border-gray-50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Payment Method</p>
                            <p className="text-sm font-black text-gray-600">Razerpay</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Doctor's Amount</p>
                            <p className="text-sm font-black text-gray-600">₹249</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Platform contribution 5%</p>
                            <p className="text-sm font-black text-gray-600">₹50</p>
                        </div>
                    </div>
                </div>

                {/* Refunds Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-[#002B49]">Refunds</h2>
                        <button className="px-8 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                            Approve
                        </button>
                    </div>
                    <div className="bg-gray-50/30 border border-gray-50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Reason</p>
                            <p className="text-sm font-black text-gray-600">By Misunderstanding</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Refund to</p>
                            <p className="text-sm font-black text-gray-600">adrian@gmail.com</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Refunded Amount</p>
                            <p className="text-sm font-black text-gray-600">₹399</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}    )
}
