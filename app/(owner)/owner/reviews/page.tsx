"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Edit2, Trash2, Loader2, MessageSquareQuote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { useOwnerReviews } from "@/lib/hooks/owner/useOwnerReviews"
import { ReviewModal } from "@/components/owner/ReviewModal"
import Swal from "sweetalert2"
import { SearchInput } from "@/components/common/ui/SearchInput"
import { Pagination } from "@/components/common/ui/Pagination"
import { useDebounce } from "@/lib/hooks/useDebounce"
import type { Review } from "@/lib/types/owner/owner.types"

const ENTRIES_PER_PAGE = 3

export default function OwnerReviewsPage() {
    const { reviews, total, totalPages, isLoading, getReviews, deleteReview } = useOwnerReviews()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)

    const fetchReviews = useCallback(async (pageNum: number, search: string = "") => {
        await getReviews(pageNum, ENTRIES_PER_PAGE, search)
    }, [getReviews])

    useEffect(() => {
        fetchReviews(page, debouncedSearch)
    }, [page, debouncedSearch, fetchReviews])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete Review?",
            text: "Are you sure? This feedback will be removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Yes, Delete",
            customClass: { popup: "rounded-[1.5rem]" },
        })

        if (result.isConfirmed) {
            const success = await deleteReview(id)
            if (success) {
                fetchReviews(page, debouncedSearch)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Feedbacks</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium tracking-tight">Review History</span>
                    </nav>
                </div>
                <SearchInput
                    placeholder="Search by doctor name..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setPage(1)
                    }}
                    containerClassName="w-full md:w-80"
                />
            </div>

            {isLoading && reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquareQuote className="text-gray-300" size={28} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No reviews shared yet</p>
                    <p className="text-[10px] text-gray-400 mt-2">Finish an appointment to share your experience!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow"
                        >
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-blue-50 shrink-0">
                                            <Image
                                                src={
                                                    review.doctorId?.userId?.profilePic ||
                                                    "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"
                                                }
                                                alt="Doctor"
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-950 text-base">
                                                Dr. {review.doctorId?.userId?.username}
                                            </h3>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                                                {review.doctorId?.profile?.designation || "Veterinary Surgeon"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex gap-1 bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-100 mr-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={cn(
                                                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedReview(review)
                                                setIsEditModalOpen(true)
                                            }}
                                            className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition text-xs font-bold border border-blue-100"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition text-xs font-bold border border-rose-100"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50/20 p-6 rounded-2xl border border-blue-50/50">
                                    <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Posted on {new Date(review.createdAt).toLocaleDateString()}</span>
                                        <span>
                                            AptID:{" "}
                                            {review.appointmentId?.appointmentId ||
                                                review.appointmentId?._id?.slice(-8).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {review.isReplied && review.reply && (
                                    <div className="ml-6 md:ml-12 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                            Doctor&apos;s response &middot;{" "}
                                            {new Date(review.reply.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 text-xs font-medium leading-relaxed italic border-l-2 border-gray-200 pl-4">
                                            {review.reply.comment}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalEntries={total}
                    entriesPerPage={ENTRIES_PER_PAGE}
                />
            </div>

            <ReviewModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                appointmentId=""
                existingReview={selectedReview}
                onSuccess={() => fetchReviews(page, debouncedSearch)}
            />
        </div>
    )
}
