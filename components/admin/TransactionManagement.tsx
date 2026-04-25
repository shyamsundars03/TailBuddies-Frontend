import React, { useState, useEffect } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { Filter, MoreVertical, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { paymentApi } from '@/lib/api/payment.api'
import { toast } from 'sonner'

export function TransactionManagement() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [activeTab, setActiveTab] = useState('Paid')
    const router = useRouter()

    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await paymentApi.getAllTransactions(page, limit, searchTerm, activeTab)
            if (response.success) {
                setTransactions(response.transactions)
                setTotal(response.total)
            } else {
                toast.error(response.message || "Failed to fetch transactions")
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
            toast.error("An error occurred while fetching transactions")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setPage(1)
        fetchTransactions()
    }, [debouncedSearch, activeTab])

    useEffect(() => {
        fetchTransactions()
    }, [page])

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount)
    }

    return (
        <div className="space-y-8 font-inter">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">Transactions</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">Transactions</span>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">System Transactions</h2>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex bg-gray-50/50 p-2.5 rounded-5xl w-fit gap-2 ">
                        {[
                            { label: 'Paid', status: 'paid' },
                            { label: 'Refunded', status: 'refunded' },
                            { label: 'All', status: '' }
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => {
                                    setActiveTab(tab.label)
                                    setPage(1)
                                }}
                                className={cn(
                                    "px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap",
                                    activeTab === tab.label 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                        : "text-gray-400 hover:text-gray-600 border border-gray-300 px-6 "
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <SearchInput 
                            placeholder="Search by transaction ID or doctor..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                            containerClassName="w-72"
                        />
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-sm font-bold">No transactions found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="group hover:bg-blue-50/20 transition-colors cursor-pointer" onClick={() => router.push(`/admin/transactionManagement/${tx._id}`)}>
                                        <td className="px-6 py-5">
                                            <span className="text-[11px] font-black text-blue-500 hover:underline">
                                                {tx.transactionID}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-50 bg-gray-100 flex items-center justify-center">
                                                    {tx.walletID?.userId?.profilePic ? (
                                                        <img src={tx.walletID.userId.profilePic} alt="User" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-400">{tx.walletID?.userId?.username?.charAt(0).toUpperCase() || 'U'}</span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-black text-blue-900">{tx.walletID?.userId?.username || 'System User'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "text-[12px] font-black",
                                                tx.type === 'credit' ? "text-emerald-600" : "text-amber-600"
                                            )}>
                                                {tx.type === 'credit' ? '+' : '-'}{formatAmount(tx.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{tx.source?.replace(/-/g, ' ')}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[11px] font-medium text-gray-400">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={cn(
                                                "inline-flex items-center justify-center px-4 py-1 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm",
                                                tx.type === 'credit' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                                            )}>
                                                {tx.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {total > limit && (
                    <div className="px-6 py-4 bg-gray-50/30">
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(total / limit) || 1}
                            onPageChange={setPage}
                            totalEntries={total}
                            entriesPerPage={limit}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
