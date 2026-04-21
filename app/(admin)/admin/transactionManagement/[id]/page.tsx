"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, User, CreditCard, Receipt, RotateCcw, CheckCircle2, Loader2, Dog, Calendar, Clock, IndianRupee, ShieldAlert } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { paymentApi } from "@/lib/api/payment.api"
import { toast } from "sonner"
import { AdminPageContainer } from "../../../../../components/common/layout/admin/PageContainer"

export default function AdminTransactionDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [transaction, setTransaction] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchTransactionDetails = async () => {
        setIsLoading(true)
        try {
            const response = await paymentApi.getTransactionDetail(id)
            if (response.success) {
                setTransaction(response.transaction)
            } else {
                toast.error(response.message || "Failed to fetch transaction details")
            }
        } catch (error) {
            console.error("Error fetching transaction details:", error)
            toast.error("Failed to fetch transaction details")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchTransactionDetails()
    }, [id])

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount)
    }

    if (isLoading) {
        return (
            <AdminPageContainer title="Transaction Ledger" activeItem="transactions">
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading transaction details...</p>
                </div>
            </AdminPageContainer>
        )
    }

    if (!transaction) return null

    const appointment = transaction.appointmentID
    const pet = appointment?.petId
    const doctor = appointment?.doctorId
    const owner = transaction.walletID?.userId

    return (
        <AdminPageContainer title="Transaction Moderation" activeItem="transactions">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#333333] uppercase tracking-tight">Financial Ledger</h1>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                            <Link href="/admin/dashboard" className="text-blue-600 hover:underline transition">Dashboard</Link>
                            <span>/</span>
                            <Link href="/admin/transactionManagement" className="text-blue-600 hover:underline transition">Transactions</Link>
                            <span>/</span>
                            <span className="text-gray-400">Ledger Detail</span>
                        </nav>
                    </div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 border border-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 hover:bg-gray-800"
                    >
                        <ChevronLeft size={16} /> Back to Ledger
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
                    {/* Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Transaction Identity Card */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 space-y-8">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Receipt size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Transaction Reference</p>
                                        <h2 className="text-xl font-black text-blue-900">{transaction.transactionID}</h2>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                                    transaction.type === 'credit' 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                        : "bg-blue-50 text-blue-600 border-blue-100"
                                )}>
                                    {transaction.type}
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-lg font-black text-blue-900">{formatAmount(transaction.amount)}</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Source Pathway</p>
                                    <p className="text-sm font-black text-gray-600 uppercase tracking-tighter">{transaction.source?.replace(/-/g, ' ')}</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Processed At</p>
                                    <p className="text-sm font-black text-gray-600">{new Date(transaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Refund Details / Cancellation Info - HIGHLIGHTED */}
                            {(transaction.source?.includes('refund') || appointment?.status === 'cancelled') && (
                                <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-8 space-y-4">
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <ShieldAlert size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Refund & Cancellation Context</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">Cancellation Reason</p>
                                        <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
                                            "{appointment?.cancellation?.cancelReason || transaction.message || "No specific reason provided by the system."}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Information Section */}
                            {appointment && (
                                <div className="space-y-6 pt-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-950 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Linked Appointment Details
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Pet Info */}
                                        <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                                {pet?.picture ? (
                                                    <img src={pet.picture} className="w-full h-full object-cover" alt="Pet" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Dog size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Patient</p>
                                                <h4 className="text-lg font-black text-blue-900">{pet?.name || 'N/A'}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize">{pet?.species} • {pet?.breed}</p>
                                            </div>
                                        </div>

                                        {/* Action items/IDs */}
                                        <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-3 shadow-sm">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-gray-400 uppercase tracking-widest">Appt ID</span>
                                                <span className="font-black text-blue-600">{appointment.appointmentId || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-gray-400 uppercase tracking-widest">Service</span>
                                                <span className="font-black text-gray-700">{appointment.serviceType || 'Normal'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-gray-400 uppercase tracking-widest">Method</span>
                                                <span className="font-black text-gray-700 uppercase">{appointment.paymentMethod || 'Wallet'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar (1/3) */}
                    <div className="space-y-8 sticky top-8">
                        {/* Involved Parties */}
                        <div className="bg-[#002B49] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
{/*                             
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-white/40 flex items-center gap-2">
                                <User size={14} /> Counterparties
                            </h3> */}

                            <div className="space-y-10">
                                {/* Owner */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 ring-2 ring-white/5">
                                        {owner?.profilePic ? (
                                            <img src={owner.profilePic} className="w-full h-full object-cover" alt="Owner" />
                                        ) : (
                                            <User className="text-white/20" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Account Owner</p>
                                        <h4 className="text-sm font-black">{owner?.username || 'System Admin'}</h4>
                                        <p className="text-[10px] font-medium text-white/40 truncate w-32">{owner?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Doctor */}
                                {doctor && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 ring-2 ring-white/5">
                                            {doctor.userId?.profilePic ? (
                                                <img src={doctor.userId.profilePic} className="w-full h-full object-cover" alt="Doctor" />
                                            ) : (
                                                <User className="text-white/20" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Service Provider</p>
                                            <h4 className="text-sm font-black">Dr. {doctor.userId?.username || 'Veterinary'}</h4>
                                            <p className="text-[10px] font-medium text-white/40">{doctor.specialization || 'General'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Quick Metrics</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40">Fee Share 5%</p>
                                        <p className="text-xl font-black text-emerald-400">
                                            {formatAmount(transaction.amount * 0.05)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white/40">Payout</p>
                                        <p className="text-lg font-black">{formatAmount(transaction.amount * 0.95)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Block */}
                        {appointment && (
                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Schedule Context</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Date</p>
                                            <p className="text-xs font-black text-blue-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                                            <p className="text-xs font-black text-blue-900">{appointment.appointmentStartTime} - {appointment.appointmentEndTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    )
}
