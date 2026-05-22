"use client"

import React, { useState, useEffect } from 'react'
import { Transaction, Appointment } from '@/lib/types/admin/admin.types'
import { 
    
     Calendar, Clock,  Mail,
      AlertCircle, FileText,
 Activity,
} from 'lucide-react'
import { paymentApi } from '@/lib/api/payment.api'
import { appointmentApi } from '@/lib/api/appointment.api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SingleTransactionView({ id }: { id: string }) {
    const router = useRouter()
    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [appointment, setAppointment] = useState<Appointment | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!id) return
            setIsLoading(true)
            try {
                const response = await paymentApi.getAllTransactions(1, 100, id)
                if (response.success && response.data && response.data.items.length > 0) {
                    const tx = response.data.items.find((t) => t._id === id || t.transactionID === id)
                    if (tx) setTransaction(tx)
                    
                    const aptId = typeof tx?.appointmentId === "string" ? tx.appointmentId : tx?.appointmentId?._id
                    if (aptId) {
                        const aptRes = await appointmentApi.getAppointmentById(aptId)
                        if (aptRes.success && aptRes.data) {
                            setAppointment(aptRes.data)
                        }
                    }
                } else {
                    toast.error("Failed to fetch transaction details")
                }
            } catch (error) {
                console.error("Error fetching transaction:", error)
                toast.error("An error occurred while fetching transaction details")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTransactionDetails()
    }, [id])

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 font-medium">Loading transaction details...</div>
    }

    if (!transaction) {
        return (
            <div className="p-12 text-center text-red-500 font-medium flex flex-col items-center gap-4">
                <AlertCircle size={48} className="text-red-300" />
                <p>Transaction not found</p>
                <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go back</button>
            </div>
        )
    }

    const user = transaction.walletID?.userId;

    return (
        <div className="font-inter">
            <div className="mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/transactionManagement')}>List of Transaction</span>
                            <span>/</span>
                            <span className="text-gray-400">{transaction.transactionID}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition shadow-sm"
                    >
                        Back
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                    {/* User Info Row */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
                            {user?.profilePic ? (
                                <Image src={user.profilePic} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-bold text-gray-400">👤</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-0.5">Primary Party</p>
                            <h3 className="text-xl font-bold text-gray-900">{user?.username || 'System User'}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Mail size={14} className="text-gray-400" />
                                    {user?.email || 'N/A'}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                                    {user?.role || 'Stakeholder'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                            <h2 className="text-3xl font-black text-gray-900">
                                ₹{transaction.amount?.toLocaleString('en-IN')}
                            </h2>
                        </div>
                    </div>

                    {/* Transaction Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction Info</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Status</p>
                                    <span className="text-emerald-600 font-bold text-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        {transaction.status || 'Verified'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Type</p>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                        transaction.type === 'credit' ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-rose-100 text-rose-800 border-rose-200"
                                    )}>
                                        {transaction.type}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Channel</p>
                                    <span className="text-gray-700 font-bold text-xs uppercase">{transaction.source?.replace(/-/g, ' ') || 'Internal'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Temporal Data</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-gray-400" size={16} />
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Date</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-gray-400" size={16} />
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Time</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reference Nodes</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">System ID</p>
                                    <p className="text-[10px] font-mono font-medium text-gray-600 truncate">{transaction._id}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Transaction ID</p>
                                    <p className="text-[10px] font-mono font-bold text-blue-600">{transaction.transactionID}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linked Consultation */}
                    {appointment && (
                        <div className="mt-12 pt-10 border-t border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" />
                                Linked Consultation Registry
                            </h2>
                            <div className="bg-gray-50/30 rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                                        <Image src={appointment.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150"} alt="Doctor" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-blue-500 font-bold uppercase">Practitioner</p>
                                        <p className="text-sm font-bold text-gray-900">Dr. {appointment.doctorId?.userId?.username}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{appointment.doctorId?.profile?.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl">🐕</div>
                                    <div>
                                        <p className="text-[10px] text-rose-500 font-bold uppercase">Patient</p>
                                        <p className="text-sm font-bold text-gray-900">{appointment.petId?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium italic">{appointment.status}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/admin/appointmentManagement/${appointment._id}`)}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
                                >
                                    <FileText size={16} />
                                    View Full Registry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// function DetailBlock({ label, value, icon }: { label: string; value?: string; icon: React.ReactNode }) {
//     return (
//         <div className="flex items-center gap-3">
//             <div className="text-slate-300">{icon}</div>
//             <div>
//                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//                 <p className="text-xs font-black text-slate-700">{value || 'N/A'}</p>
//             </div>
//         </div>
//     )
// }
