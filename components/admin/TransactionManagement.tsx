"use client"

import React, { useState } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { Filter, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
    id: string
    invoiceNumber: string
    ownerId: string
    ownerName: string
    ownerImage: string
    totalAmount: string
    purpose: string
    status: 'Paid' | 'Pending' | 'Refunded'
}

const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        invoiceNumber: '#IN0001',
        ownerId: '#OW001',
        ownerName: 'Charlene Reed',
        ownerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
        totalAmount: '₹100.00',
        purpose: 'Consultation',
        status: 'Paid'
    },
    {
        id: '2',
        invoiceNumber: '#IN0002',
        ownerId: '#OW002',
        ownerName: 'Travis Trimble',
        ownerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
        totalAmount: '₹200.00',
        purpose: 'Consultation',
        status: 'Paid'
    },
    {
        id: '3',
        invoiceNumber: '#IN0003',
        ownerId: '#OW003',
        ownerName: 'Carl Kelly',
        ownerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
        totalAmount: '₹250.00',
        purpose: 'Consultation',
        status: 'Paid'
    }
]

export function TransactionManagement() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('Paid')
    const router = useRouter()

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

            {/* Main Content Area (Remove outer white card if PageContainer has one, but PageContainer DOES have one) */}
            {/* Actually, looking at PageContainer, it provides a 2xl rounded p-6 bg-white card. */}
            
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">Based on Service</h2>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex bg-gray-50/50 p-1.5 rounded-2xl w-fit overflow-x-auto scrollbar-hide">
                        {[
                            { label: 'Paid', count: 21 },
                            { label: 'Subscription', count: 16 },
                            { label: 'Refunded', count: 214 }
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={cn(
                                    "px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap",
                                    activeTab === tab.label 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab.label}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-black",
                                    activeTab === tab.label ? "bg-white/20" : "bg-gray-100"
                                )}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] font-bold text-[#002B49]">08/04/2020 - 08/11/2020</span>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-4 h-4 text-[#002B49]" />
                            <span className="text-[10px] font-black text-[#002B49] uppercase tracking-widest">Filter By</span>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice Number</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner ID</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner Name</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {DUMMY_TRANSACTIONS.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-blue-50/20 transition-colors cursor-pointer" onClick={() => router.push(`/admin/transactionManagement/${tx.id}`)}>
                                    <td className="px-6 py-5">
                                        <span className="text-[13px] font-black text-blue-500 hover:underline">
                                            {tx.invoiceNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[13px] font-bold text-[#002B49]">{tx.ownerId}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-50">
                                                <img src={tx.ownerImage} alt={tx.ownerName} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[13px] font-black text-blue-500 hover:underline">{tx.ownerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[13px] font-black text-[#002B49]">{tx.totalAmount}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[13px] font-bold text-gray-500">{tx.purpose}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center justify-center px-6 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing 1 to 7 of 12 entries
                    </p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 text-gray-400 hover:text-gray-600 font-bold text-[11px] uppercase tracking-widest">Previous</button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-[11px]">1</button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-400 text-gray-900 font-bold text-[11px] shadow-md">2</button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-[11px]">3</button>
                        <button className="px-3 py-1 text-gray-900 hover:text-black font-bold text-[11px] uppercase tracking-widest">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
