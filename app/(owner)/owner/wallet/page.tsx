"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, Loader2, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { paymentApi } from "@/lib/api/payment.api"
import { toast } from "sonner"
import { Pagination } from "../../../../components/common/ui/Pagination"

interface WalletData {
    balance: number
}

interface Transaction {
    transactionID?: string
    _id?: string
    humanReadableId?: string
    source: string
    type: 'credit' | 'debit'
    createdAt: string
    amount: number
    appointmentID?: string
    message?: string
}

interface RazorpayResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

interface RazorpayWindow extends Window {
    Razorpay: new (options: Record<string, unknown>) => {
        open: () => void
    }
}

function WalletPageContent() {
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isTopUpLoading, setIsTopUpLoading] = useState(false)
    const [topUpAmount, setTopUpAmount] = useState<string>("")
    const [showTopUpModal, setShowTopUpModal] = useState(false)
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const entriesPerPage = 10

    const fetchWalletData = useCallback(async () => {
        try {
            const res = await paymentApi.getWallet()
            if (res.success) setWallet(res.wallet)
        } catch (error) {
            console.error("Error fetching wallet:", error)
        }
    }, [])

    const fetchTransactions = useCallback(async (page: number) => {
        setIsLoading(true)
        try {
            const res = await paymentApi.getTransactions(page, entriesPerPage)
            if (res.success) {
                setTransactions(res.transactions)
                setTotalEntries(res.total)
                setTotalPages(Math.ceil(res.total / entriesPerPage))
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
        } finally {
            setIsLoading(false)
        }
    }, [entriesPerPage])

    useEffect(() => {
        fetchWalletData()
        fetchTransactions(currentPage)

        // Load Razorpay Script
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    }, [currentPage, fetchWalletData, fetchTransactions])

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount)
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        setIsTopUpLoading(true)
        try {
            // Reusing createRazorpayOrder for top-up by passing appointmentId as 'topup'
            const orderRes = await paymentApi.createRazorpayOrder({
                amount,
                appointmentId: "topup"
            })

            if (!orderRes.success) {
                toast.error(orderRes.message || "Failed to initiate top-up")
                setIsTopUpLoading(false)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderRes.order.amount,
                currency: orderRes.order.currency,
                name: "TailBuddies Wallet",
                description: "Wallet Top-up",
                order_id: orderRes.order.id,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyRes = await paymentApi.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            appointmentId: "topup"
                        })

                        if (verifyRes.success) {
                            toast.success("Wallet topped up successfully!")
                            setShowTopUpModal(false)
                            setTopUpAmount("")
                            // Refresh data
                            await fetchWalletData()
                            await fetchTransactions(1)
                        } else {
                            toast.error(verifyRes.message || "Verification failed. Please contact support.")
                        }
                    } catch (err: unknown) {
                        console.error("Verification error:", err)
                        toast.error("An error occurred during verification")
                    } finally {
                        setIsTopUpLoading(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsTopUpLoading(false)
                    }
                },
                theme: {
                    color: "#2563eb"
                }
            }

            const rzp = new (window as unknown as RazorpayWindow).Razorpay(options)
            rzp.open()
        } catch (error: unknown) {
            console.error("Top-up error:", error)
            toast.error("An error occurred during top-up")
            setIsTopUpLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }


console.log(transactions)


    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight mb-2">My Wallet</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manage your balance and view transactions</p>
                </div>
                <button
                    onClick={() => setShowTopUpModal(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-200"
                >
                    <Plus size={18} />
                    Add Money
                </button>
            </div>

            {/* Wallet Card */}
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
                            <span className="font-bold uppercase tracking-[0.2em] text-sm opacity-80">Current Balance</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-6xl font-black tracking-tighter">₹{wallet?.balance?.toLocaleString() || "0"}</h2>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Verified & Secure</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Status</p>
                                <p className="font-bold uppercase text-xs">Active Account</p>
                            </div>
                            <div className="flex-1 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Account Type</p>
                                <p className="font-bold uppercase text-xs">Personal Wallet</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col justify-center space-y-8">
                    <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Quick Stats</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                                    <ArrowUpRight size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Added</span>
                            </div>
                            <span className="font-bold text-gray-900">₹{transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                    <ArrowDownLeft size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</span>
                            </div>
                            <span className="font-bold text-gray-900">₹{transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="w-full py-4 text-blue-600 font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 rounded-xl transition-all">
                        View Detailed Report
                    </button>
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {/* <Search size={14} /> */}
                        {/* Filter */}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID & Purpose</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Fetching Transactions...</span>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((t) => (
                                    
                                    <tr key={t.transactionID || t._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1">
                                                    {t.humanReadableId ? `#${t.humanReadableId}` : `#${t.transactionID?.slice(-8) || ''}`}
                                                </span>
                                                <span className="text-sm font-bold text-gray-800 capitalize">
                                                    {t.source.replace(/-/g, ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                t.type === 'credit' ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                                            )}>
                                                {t.type === 'credit' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "font-black text-sm",
                                                t.type === 'credit' ? "text-emerald-500" : "text-gray-900"
                                            )}>
                                                {t.type === 'credit' ? "+" : "-"} ₹{t.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {(() => {
                                                const effectiveAppId = t.appointmentID || (t.message?.includes('appointment') ? t.message.split(' ').pop() : null);
                                                return effectiveAppId ? (
                                                    <button
                                                        onClick={() => window.location.href = `/owner/bookings/${effectiveAppId}`}
                                                        className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-blue-100"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">N/A</span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center uppercase text-[10px] font-bold text-gray-300 tracking-[0.2em]">
                                        No transactions recorded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.length > 0 && (
                    <div className="p-8 border-t border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalEntries={totalEntries}
                            entriesPerPage={entriesPerPage}
                        />
                    </div>
                )}
            </div>

            {/* Top-up Modal */}
            {showTopUpModal && (
                <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 space-y-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Add Balance</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instant Top-up via Razorpay</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] ml-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                />
                            </div>

                            <div className="flex gap-2">
                                {[500, 1000, 2000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTopUpAmount(amt.toString())}
                                        className="flex-1 py-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-blue-100"
                                    >
                                        +₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={handleTopUp}
                                disabled={isTopUpLoading}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {isTopUpLoading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={18} />}
                                Proceed to Pay
                            </button>
                            <button
                                onClick={() => setShowTopUpModal(false)}
                                disabled={isTopUpLoading}
                                className="w-full py-4 text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest text-[10px] transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function WalletPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <WalletPageContent />
        </Suspense>
    )
}
