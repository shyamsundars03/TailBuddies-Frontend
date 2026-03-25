"use client"

import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, User, CreditCard, Receipt, RotateCcw, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

export default function AdminTransactionDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#002B49]">Transactions</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Link href="/admin/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/admin/transactionManagement" className="hover:text-blue-600 transition">Transactions</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">TransactionID</span>
                    </nav>
                </div>
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-8 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                    Back
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10 space-y-10">
                {/* Header Strip */}
                <div className="flex flex-wrap items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-gray-100 p-1">
                            <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor" width={44} height={44} className="w-full h-full object-cover rounded-lg" />
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
}
