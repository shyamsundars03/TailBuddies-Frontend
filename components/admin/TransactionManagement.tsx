"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Transaction } from '@/lib/types/admin/admin.types'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import Link from 'next/link'
import Image from 'next/image'
import { paymentApi } from '@/lib/api/payment.api'
import { toast } from 'sonner'
import { ADMIN_ROUTES } from '../../lib/constants';


export function TransactionManagement() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 1000)
    const [activeTab, setActiveTab] = useState('All')
    const router = useRouter()

    const tabs = ['All', 'Paid', 'Refunded']

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true)
        try {
            const statusQuery = activeTab === 'All' ? '' : activeTab.toLowerCase()
            const response = await paymentApi.getAllTransactions(page, limit, debouncedSearch, statusQuery)
            if (response.success && response.data) {
                setTransactions(Array.isArray(response.data.items) ? response.data.items : [])
                setTotal(response.data.total || 0)
            } else {
                toast.error(response.message || "Failed to fetch transactions")
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
            toast.error("An error occurred while fetching transactions")
        } finally {
            setIsLoading(false)
        }
    }, [page, limit, debouncedSearch, activeTab])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, activeTab])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount)
    }

    const columns: Column<Transaction>[] = [
        { 
            header: "Transaction Node", 
            accessor: (tx) => (
                <span className="text-xs font-black text-blue-600 font-mono tracking-tighter">
                    {tx.transactionID}
                </span>
            )
        },
        { 
            header: "Primary Party", 
            accessor: (tx) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                        {tx.walletID?.userId?.profilePic ? (
                            <Image src={tx.walletID.userId.profilePic} alt="User" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-gray-400">👤</span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-800 truncate">{tx.walletID?.userId?.username || 'Unknown'}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{tx.walletID?.userId?.role || 'Stakeholder'}</span>
                    </div>
                </div>
            )
        },
        { 
            header: "Amount", 
            accessor: (tx) => formatAmount(tx.amount),
            className: "text-sm font-black text-gray-900"
        },
        { 
            header: "Flow Type", 
            accessor: (tx) => (
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    tx.type === 'credit' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                    {tx.type}
                </span>
            )
        },
        { 
            header: "Registry Status", 
            accessor: (tx) => (
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {tx.status || 'Verified'}
                </span>
            )
        }
    ]

    return (
        <div className="font-inter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Transaction</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href={ADMIN_ROUTES.DASHBOARD} className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">List of Transactions</span>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab)
                                    setPage(1)
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                                    activeTab === tab
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <SearchInput
                        placeholder="Search Transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        containerClassName="w-full md:w-72"
                    />
                </div>

                <DataTable 
                    columns={columns}
                    data={transactions}
                    isLoading={isLoading}
                    keyExtractor={(tx) => tx._id}
                    onRowClick={(tx) => router.push(`/admin/transactionManagement/${tx._id}`)}
                    emptyMessage="Empty Ledger"
                />

                <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(total / limit) || 1}
                        onPageChange={setPage}
                        totalEntries={total}
                        entriesPerPage={limit}
                    />
                </div>
            </div>
        </div>
    )
}
