"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Edit2, Trash2, Loader2, Calendar, MessageSquareQuote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { reviewApi } from "@/lib/api/review.api"
import { toast } from "sonner"
import { ReviewModal } from "@/components/owner/ReviewModal"
import Swal from "sweetalert2"

export default function OwnerReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState<any>(null)

    const fetchReviews = useCallback(async () => {
        setIsLoading(true)
        const response = await reviewApi.getOwnerReviews()
        if (response.success) {
            setReviews(response.data)
        } else {
            toast.error(response.message || "Failed to fetch reviews")
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: "Are you sure? This feedback will be removed permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete',
            customClass: { popup: 'rounded-[1.5rem]' }
        })

        if (result.isConfirmed) {
            const response = await reviewApi.delete(id)
            if (response.success) {
                toast.success("Review deleted")
                fetchReviews()
            } else {
                toast.error(response.message || "Failed to delete review")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading reviews...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Feedbacks</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium tracking-tight">Review History</span>
                    </nav>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquareQuote className="text-gray-300" size={28} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No reviews shared yet</p>
                    <p className="text-[10px] text-gray-400 mt-2">Finish an appointment to share your experience!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-blue-50 flex-shrink-0">
                                            <Image 
                                                src={review.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                                                alt="Doctor" width={56} height={56} className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-950 text-base">Dr. {review.doctorId?.userId?.username}</h3>
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
                                                        "transition-all",
                                                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                                    )} 
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedReview(review)
                                                    setIsEditModalOpen(true)
                                                }}
                                                className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold border border-blue-100"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(review._id)}
                                                className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-xs font-bold border border-rose-100"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-blue-50/20 p-6 rounded-2xl border border-blue-50/50">
                                        <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                                            "{review.comment}"
                                        </p>
                                        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Posted on {new Date(review.createdAt).toLocaleDateString()}</span>
                                            <span>AptID: {review.appointmentId?.appointmentId || review.appointmentId?._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    {review.isReplied && review.reply && (
                                        <div className="ml-6 md:ml-12 bg-gray-50/80 rounded-2xl p-6 space-y-3 border border-gray-100 relative before:absolute before:-left-6 before:top-8 before:w-6 before:h-0.5 before:bg-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-white flex-shrink-0">
                                                    <Image 
                                                        src={review.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                                                        alt="Doctor" width={32} height={32} className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-900 text-[11px] uppercase tracking-wide">Doctor's Response</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Replied {new Date(review.reply.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-xs font-medium leading-relaxed italic pl-4 border-l-2 border-gray-200">
                                                {review.reply.comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ReviewModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                appointmentId="" 
                existingReview={selectedReview}
                onSuccess={fetchReviews}
            />
        </div>
    )
}
