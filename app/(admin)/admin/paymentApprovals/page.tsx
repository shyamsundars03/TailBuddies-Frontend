"use client"

import { useEffect, useState, useCallback } from "react"
import { CheckCircle, XCircle, Eye, Loader2, IndianRupee } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { paymentApi } from "@/lib/api/payment.api"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { DataTable, Column } from "../../../../components/common/ui/DataTable"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { SearchInput } from "../../../../components/common/ui/SearchInput"
import { useDebounce } from "@/lib/hooks/useDebounce"

export default function AdminPaymentApprovalsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [statusTab, setStatusTab] = useState("Pending")
    const [totalEntries, setTotalEntries] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)
    const itemsPerPage = 8

    const statuses = ["All", "Pending", "Completed", "Rejected"]

    const fetchRequests = useCallback(async (page: number, search: string, status: string) => {
        setIsLoading(true)
        try {
            // If status is 'All', we pass empty string or handle it
            const statusQuery = status === "All" ? "" : status.toUpperCase()
            const response = await paymentApi.getAllTransactions(page, itemsPerPage, search, statusQuery)
            if (response.success) {
                setRequests(response.transactions || [])
                setTotalEntries(response.total || 0)
            } else {
                toast.error(response.message || "Failed to fetch requests")
            }
        } catch (error) {
            console.error("Error fetching requests:", error)
        } finally {
            setIsLoading(false)
        }
    }, [itemsPerPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, statusTab])

    useEffect(() => {
        fetchRequests(currentPage, debouncedSearch, statusTab)
    }, [fetchRequests, currentPage, debouncedSearch, statusTab])

    const handleApprove = async (id: string, amount: number) => {
        const result = await Swal.fire({
            title: 'Approve Withdrawal?',
            text: `Confirming withdrawal of ₹${amount}. This will update the doctor's wallet balance.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Approve',
            customClass: { popup: 'rounded-[2rem]' }
        })

        if (result.isConfirmed) {
            try {
                const response = await paymentApi.approveWithdrawal(id)
                if (response.success) {
                    toast.success("Withdrawal approved")
                    fetchRequests()
                } else {
                    toast.error(response.message || "Failed to approve withdrawal")
                }
            } catch (err) {
                toast.error("An error occurred during approval")
            }
        }
    }

    const handleReject = async (id: string) => {
        const result = await Swal.fire({
            title: 'Reject Request?',
            text: "Are you sure you want to reject this withdrawal request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Reject',
            customClass: { popup: 'rounded-[2rem]' }
        })

        if (result.isConfirmed) {
            try {
                const response = await paymentApi.rejectWithdrawal(id)
                if (response.success) {
                    toast.success("Request rejected")
                    fetchRequests()
                } else {
                    toast.error(response.message || "Failed to reject request")
                }
            } catch (err) {
                toast.error("An error occurred during rejection")
            }
        }
    }

    const columns: Column<any>[] = [
        {
            header: "Doctor",
            accessor: (tx) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 bg-gray-50 flex items-center justify-center">
                        {tx.walletID?.userId?.profilePic ? (
                            <Image 
                                src={tx.walletID.userId.profilePic} 
                                alt="Doctor" width={40} height={40} className="w-full h-full object-cover" 
                            />
                        ) : (
                            <span className="text-sm font-black text-gray-300">{tx.walletID?.userId?.username?.[0] || 'D'}</span>
                        )}
                    </div>
                    <div>
                        <span className="text-sm font-black text-blue-950 uppercase tracking-tight block">
                            {tx.walletID?.userId?.username || 'Unknown Doctor'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {tx.walletID?.userId?.email || 'No email'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Requested Gross",
            accessor: (tx) => (
                <div className="flex items-center gap-1 text-gray-500 font-bold text-xs">
                    <IndianRupee size={12} />
                    <span>{tx.amount.toLocaleString('en-IN')}</span>
                </div>
            )
        },
        {
            header: "10% Share",
            accessor: (tx) => (
                <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                    <IndianRupee size={12} />
                    <span>{(tx.commission || (tx.amount * 0.1)).toLocaleString('en-IN')}</span>
                </div>
            )
        },
        {
            header: "Net Payout",
            accessor: (tx) => (
                <div className="flex items-center gap-1 text-blue-900 font-black">
                    <IndianRupee size={14} />
                    <span className="text-sm">{(tx.netAmount || (tx.amount * 0.9)).toLocaleString('en-IN')}</span>
                </div>
            )
        },
        {
            header: "Date",
            accessor: (tx) => (
                <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-700">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (tx) => (
                <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-xs",
                    tx.status === 'PENDING' ? "bg-amber-100 text-amber-600" :
                    tx.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" :
                    "bg-rose-100 text-rose-600"
                )}>
                    {tx.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (tx) => (
                <div className="flex items-center justify-end gap-2">
                    {tx.status === 'PENDING' && (
                        <>
                            <button 
                                onClick={() => handleApprove(tx._id, tx.amount)}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm group"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleReject(tx._id)}
                                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm group"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}
                    <Link 
                        href={`/admin/transactionManagement/${tx._id}`}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-200 hover:text-gray-600 transition-all shadow-sm"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </Link>
                </div>
            ),
            className: "text-right"
        }
    ]

    return (
        <AdminPageContainer title="Payment Approvals" activeItem="payments">
            <div className="bg-gray-50/50 min-h-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#333333] mb-1">Withdrawal Requests</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                            <span>/</span>
                            <span className="text-gray-400">Payment Approvals</span>
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusTab(status)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                statusTab === status 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105" 
                                    : "bg-white text-gray-400 hover:text-blue-600 border border-gray-100 hover:border-blue-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <div>
                            <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em]">{statusTab} Requests</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Manage and monitor {statusTab.toLowerCase()} withdrawal entries.</p>
                        </div>
                        <SearchInput
                            placeholder="Search by doctor name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            containerClassName="w-72"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={requests}
                        keyExtractor={(r) => r._id}
                        isLoading={isLoading}
                        emptyMessage="No pending withdrawal requests found."
                        className="border-0 shadow-none rounded-none"
                    />

                    <div className="px-6 py-4 bg-gray-50/30">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalEntries / itemsPerPage) || 1}
                            onPageChange={setCurrentPage}
                            totalEntries={totalEntries}
                            entriesPerPage={itemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    )
}
