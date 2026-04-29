"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Eye, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { reviewApi } from "@/lib/api/review.api"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { SearchInput } from "../../../../components/common/ui/SearchInput"
import { DataTable, Column } from "../../../../components/common/ui/DataTable"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { useDebounce } from "@/lib/hooks/useDebounce"

export default function AdminReviewsListingPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const itemsPerPage = 4

    const fetchReviews = useCallback(async (page: number, search: string) => {
        setIsLoading(true)
        const response = await reviewApi.getAllReviews(page, itemsPerPage, search)
        if (response.success) {
            setReviews(response.data)
            setTotalEntries(response.total || 0)
        } else {
            toast.error(response.message || "Failed to fetch reviews")
        }
        setIsLoading(false)
    }, [itemsPerPage])

    useEffect(() => {
        fetchReviews(1, debouncedSearch)
        setCurrentPage(1)
    }, [debouncedSearch, fetchReviews])

    useEffect(() => {
        fetchReviews(currentPage, debouncedSearch)
    }, [currentPage, debouncedSearch, fetchReviews])

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: "This will permanently remove the review and any associated doctor reply.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete',
            customClass: { popup: 'rounded-[2rem]' }
        })

        if (result.isConfirmed) {
            const response = await reviewApi.delete(id)
            if (response.success) {
                toast.success("Review deleted")
                fetchReviews(currentPage, debouncedSearch)
            } else {
                toast.error(response.message || "Failed to delete review")
            }
        }
    }

    // Backend handles pagination now
    const displayReviews = reviews

    const columns: Column<any>[] = [
        {
            header: "Doctor Name",
            accessor: (review) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                        <Image 
                            src={review.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                            alt="Doctor" width={40} height={40} className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <span className="text-sm font-black text-blue-950 uppercase tracking-tight block">Dr. {review.doctorId?.userId?.username}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {review.doctorId?.profile?.designation || "General Specialist"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Patient Name",
            accessor: (review) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
                        <Image 
                            src={review.ownerId?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"} 
                            alt="Patient" width={32} height={32} className="w-full h-full object-cover" 
                        />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{review.ownerId?.username}</span>
                </div>
            )
        },
        {
            header: "Appointment",
            accessor: (review) => (
                <div className="space-y-0.5">
                    <p className="text-xs font-black text-gray-900 leading-none">
                        {new Date(review.appointmentId?.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {review.appointmentId?.appointmentStartTime}
                    </p>
                </div>
            )
        },
        {
            header: "Rating",
            accessor: (review) => (
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                    ))}
                </div>
            ),
            className: "text-center"
        },
        {
            header: "Actions",
            accessor: (review) => (
                <div className="flex items-center justify-end gap-2">
                    <Link 
                        href={`/admin/reviews/${review._id}`}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                        <Eye size={16} />
                    </Link>
                    {/* <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={16} />
                    </button> */}
                </div>
            ),
            className: "text-right"
        }
    ]

    return (
        <AdminPageContainer title="Review Management" activeItem="reviews">
            <div className="bg-gray-50/50 min-h-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#333333] mb-1">Ratings / Reviews</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                            <span>/</span>
                            <span className="text-gray-400">Reviews</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-blue-900/80">Reviews Database</h2>
                        <SearchInput
                            placeholder="Search by doctor or patient..."
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
                        data={displayReviews}
                        keyExtractor={(r) => r._id}
                        isLoading={isLoading}
                        emptyMessage="No reviews found in the database."
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
