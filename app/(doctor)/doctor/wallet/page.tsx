"use client"

import { useEffect, useState } from "react"
import { paymentApi } from "@/lib/api/payment.api"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Loader2, History } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { format } from "date-fns"
import { Pagination } from "@/components/common/ui/Pagination"

export default function DoctorWalletPage() {
    const [wallet, setWallet] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const limit = 10

    const fetchData = async (pageNum: number = 1) => {
        setIsLoading(true)
        const [walletRes, transRes] = await Promise.all([
            paymentApi.getWallet(),
            paymentApi.getTransactions(pageNum, limit)
        ])
        
        if (walletRes.success) setWallet(walletRes.wallet)
        if (transRes.success) {
            setTransactions(transRes.transactions || [])
            setTotalEntries(transRes.total || 0)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData(page)
    }, [page])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleWithdrawRequest = async () => {
        if (!wallet || wallet.balance <= 0) {
            toast.error("Insufficient balance for withdrawal")
            return
        }

        const result = await Swal.fire({
            title: 'Request Withdrawal',
            text: `Your withdrawal request for ₹${wallet.balance} will be sent to admin for approval. (Note: Company share 10% will be collected and remaining will be withdrawn). Process usually takes 24-48 hours.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Submit Request',
            customClass: { popup: 'rounded-[2rem]' }
        })

        if (result.isConfirmed) {
            setIsActionLoading(true)
            const response = await paymentApi.requestWithdrawal(wallet.balance)
            if (response.success) {
                toast.success(response.message || "Request submitted successfully")
                fetchData()
            } else {
                toast.error(response.message || "Failed to submit request")
            }
            setIsActionLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Secure Wallet...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight mb-2">My Wallet</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manage your earnings and view transaction history</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Account</span>
                    </div>
                </div>
            </div>

            {/* Wallet & Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-linear-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Wallet size={180} />
                    </div>
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                                <Wallet size={24} />
                            </div>
                            <span className="font-bold uppercase tracking-[0.2em] text-sm opacity-80">Available Balance</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-6xl font-black tracking-tighter">₹{wallet?.balance?.toLocaleString() || "0"}</h2>
                                    {wallet?.isRequested && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-amber-400 text-blue-900 rounded-full shadow-lg shadow-amber-400/20 animate-pulse">
                                                On Hold
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex-1 min-w-[120px]">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Status</p>
                                        <p className="font-bold uppercase text-xs">Active</p>
                                    </div>
                                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex-1 min-w-[120px]">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Earnings</p>
                                        <p className="font-bold uppercase text-xs">Verified</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full sm:w-auto sm:min-w-[280px]">
                                {wallet?.isRequested ? (
                                    <div className="w-full p-6 bg-white/10 border border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Review in Progress</span>
                                        </div>
                                        <p className="text-[9px] text-center font-bold text-blue-100 uppercase tracking-wider leading-relaxed">
                                            Funds are securely held and will be<br/>deducted only after Admin approval.
                                        </p>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleWithdrawRequest}
                                        disabled={isActionLoading || wallet?.balance <= 0}
                                        className={cn(
                                            "w-full px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl",
                                            wallet?.balance > 0
                                                ? "bg-white text-blue-600 hover:bg-blue-50 shadow-white/10" 
                                                : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                                        )}
                                    >
                                        {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={18} />}
                                        Request Withdrawal
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] border-b border-gray-50 pb-4 mb-6">Withdrawal Policy</h3>
                        <div className="space-y-6">
                            <PolicyItem 
                                icon={<Clock className="text-blue-500" size={18} />} 
                                title="Processing Time" 
                                desc="24-48 hours usually" 
                            />
                            <PolicyItem 
                                icon={<AlertCircle className="text-amber-500" size={18} />} 
                                title="Total Limits" 
                                desc="Withdraw your full balance" 
                            />
                        </div>
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-6 text-center">
                        Securely managed by TailBuddies Financial
                    </p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <History size={18} />
                        </div>
                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.2em]">Transaction History</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Purpose & ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Records...</span>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    (tx.type === 'credit' || tx.type === 'DOC_CREDIT') ? "bg-emerald-50 text-emerald-500" : 
                                                    tx.type === 'requested' ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                                                )}>
                                                    {tx.type === 'requested' ? <Clock size={20} /> : (tx.type === 'credit' || tx.type === 'DOC_CREDIT') ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                                                        {tx.type === 'requested' ? "Withdrawal Requested" : (tx.type === 'credit' || tx.type === 'DOC_CREDIT') ? "Appointment Earnings" : "Withdrawal Transfer"}
                                                    </p>
                                                    {tx.message && (
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight max-w-[200px] mt-0.5">
                                                            {tx.message}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        TXN: {tx._id?.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                tx.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600" : 
                                                tx.status === 'PENDING' ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500">
                                                {tx.createdAt ? format(new Date(tx.createdAt), 'dd MMM yyyy') : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "font-black text-sm",
                                                    (tx.type === 'credit' || tx.type === 'DOC_CREDIT') ? "text-emerald-500" : 
                                                    tx.type === 'requested' ? "text-amber-600" : "text-gray-900"
                                                )}>
                                                    {(tx.type === 'credit' || tx.type === 'DOC_CREDIT') ? "+" : tx.type === 'requested' ? "" : "-"} ₹{tx.amount.toLocaleString()}
                                                </span>
                                                {tx.netAmount && tx.type === 'requested' && (
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                                                        Estimated Payout: ₹{tx.netAmount.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center uppercase text-[10px] font-bold text-gray-300 tracking-[0.2em]">
                                        No transactions recorded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalEntries > limit && (
                    <div className="p-8 border-t border-gray-50">
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(totalEntries / limit)}
                            onPageChange={handlePageChange}
                            totalEntries={totalEntries}
                            entriesPerPage={limit}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

function PolicyItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className="text-[11px] font-black text-blue-950 leading-none mb-1">{title}</p>
                <p className="text-[10px] font-bold text-gray-400 leading-tight">{desc}</p>
            </div>
        </div>
    )
}


