"use client"

import React, { useState } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'

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

    const columns: Column<Transaction>[] = [
        {
            header: "Invoice Number",
            accessor: (tx) => <span className="text-blue-600 font-bold text-xs">#{tx.invoiceNumber}</span>
        },
        { header: "Owner ID", accessor: "ownerId", className: "text-xs font-bold text-gray-700" },
        {
            header: "Owner Name",
            accessor: (tx) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                        <img src={tx.ownerImage} alt={tx.ownerName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer">
                        {tx.ownerName}
                    </span>
                </div>
            )
        },
        { header: "Total Amount", accessor: "totalAmount", className: "text-xs font-black text-gray-900" },
        { header: "Purpose", accessor: "purpose", className: "text-xs font-bold text-gray-500" },
        {
            header: "Status",
            accessor: (tx) => (
                <span className="px-5 py-1 bg-green-600 text-white text-[10px] font-black rounded-lg">
                    {tx.status}
                </span>
            ),
            className: "text-right"
        }
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-black text-blue-950 mb-6 uppercase tracking-wider">Based on Service</h3>

                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        {[
                            { label: 'Paid', count: 21 },
                            { label: 'Subscription', count: 16 },
                            { label: 'Refunded', count: 214 }
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-3 transition shadow-xs border",
                                    activeTab === tab.label
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                                )}
                            >
                                {tab.label}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-black",
                                    activeTab === tab.label ? "bg-white/20 text-white" : "bg-white text-gray-400 border border-gray-100"
                                )}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="08/04/2020 - 08/11/2020"
                                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-gray-600 w-48 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-lg text-[11px] font-black text-gray-500 hover:bg-gray-50 shadow-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter By
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={DUMMY_TRANSACTIONS}
                keyExtractor={(tx) => tx.id}
                onRowClick={(tx) => router.push(`/admin/transactionManagement/${tx.id}`)}
                className="border-0 shadow-none rounded-none"
            />

            <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
                <span className="text-[11px] text-gray-500 font-medium">Showing 1 to 7 of 12 entries</span>
                <div className="flex gap-1.5">
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-400 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 bg-yellow-400 text-gray-900 rounded text-[11px] font-black">1</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">2</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">3</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">Next</button>
                </div>
            </div>
        </div>
    )
}
