import React, { useState, useEffect } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { Loader2 } from 'lucide-react'
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
    const [activeTab, setActiveTab] = useState('All')
    const router = useRouter()

    const tabs = ['All', 'Paid', 'Refunded']

    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            const statusQuery = activeTab === 'All' ? '' : activeTab.toLowerCase()
            const response = await paymentApi.getAllTransactions(page, limit, searchTerm, statusQuery)
            if (response.success) {
                setTransactions(response.transactions || [])
                setTotal(response.total || 0)
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

    const columns: Column<any>[] = [
        {
            header: "Transaction ID",
            accessor: (tx) => (
                <span className="text-[11px] font-black text-blue-500 hover:underline">
                    {tx.transactionID}
                </span>
            )
        },
        {
            header: "User",
            accessor: (tx) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        {tx.walletID?.userId?.profilePic ? (
                            <img src={tx.walletID.userId.profilePic} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-bold text-gray-400">{tx.walletID?.userId?.username?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px] block leading-none">
                            {tx.walletID?.userId?.username || 'System User'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            accessor: (tx) => (
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                    tx.walletID?.userId?.role === 'doctor' ? "text-blue-600 bg-blue-50" : "text-purple-600 bg-purple-50"
                )}>
                    {tx.walletID?.userId?.role || 'User'}
                </span>
            )
        },
        {
            header: "Amount",
            accessor: (tx) => (
                <span className={cn(
                    "text-xs font-black",
                    tx.type === 'credit' ? "text-emerald-600" : "text-amber-600"
                )}>
                    {tx.type === 'credit' ? '+' : '-'}{formatAmount(tx.amount)}
                </span>
            )
        },
        {
            header: "Source",
            accessor: (tx) => (
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight bg-gray-100 px-2 py-0.5 rounded">
                    {tx.source?.replace(/-/g, ' ')}
                </span>
            )
        },
        {
            header: "Date",
            accessor: (tx) => (
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        },
        {
            header: "Type",
            className: "text-right",
            accessor: (tx) => (
                <span className={cn(
                    "px-4 py-1 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm",
                    tx.type === 'credit' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                )}>
                    {tx.type}
                </span>
            )
        }
    ]

    return (
        <div className="space-y-4">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1 tracking-tight">System Transactions</h1>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span>Finance Management</span>
                    <span>/</span>
                    <span className="text-gray-300">Transactions</span>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab)
                            setPage(1)
                        }}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            activeTab === tab
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                : "bg-white text-gray-400 hover:text-blue-600 border border-gray-100"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                        Showing {transactions.length} of {total} Transactions
                    </p>
                    <SearchInput
                        placeholder="Search by ID, user or source..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setPage(1)
                        }}
                        containerClassName="w-72"
                    />
                </div>

                {isLoading && transactions.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Records...</p>
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={transactions}
                            keyExtractor={(tx) => tx._id}
                            onRowClick={(tx) => router.push(`/admin/transactionManagement/${tx._id}`)}
                            className="border-0 shadow-none rounded-none"
                        />

                        {total > limit && (
                            <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50">
                                <Pagination
                                    currentPage={page}
                                    totalPages={Math.ceil(total / limit) || 1}
                                    onPageChange={setPage}
                                    totalEntries={total}
                                    entriesPerPage={limit}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
