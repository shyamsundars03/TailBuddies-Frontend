"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, MessageSquare, Edit2, Trash2, Loader2, Calendar, CheckCircle2, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { reviewApi } from "@/lib/api/review.api"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { Pagination } from "@/components/common/ui/Pagination"

export default function DoctorReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyComment, setReplyComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const fetchReviews = useCallback(async (pageNum: number = 1) => {
        setIsLoading(true)
        const response = await reviewApi.getDoctorReviews(pageNum, 4)
        if (response.success) {
            setReviews(response.data)
            setTotal(response.total || 0)
            setTotalPages(response.totalPages || 1)
        } else {
            toast.error(response.message || "Failed to fetch reviews")
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchReviews(page)
    }, [fetchReviews, page])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleReplySubmit = async (reviewId: string, isUpdate = false) => {
        if (!replyComment.trim()) {
            toast.error("Reply cannot be empty")
            return
        }

        const wordCount = replyComment.trim().split(/\s+/).filter(Boolean).length
        if (wordCount > 100) {
            toast.error("Reply cannot exceed 100 words")
            return
        }

        setIsSubmitting(true)
        const response = isUpdate 
            ? await reviewApi.updateReply(reviewId, replyComment)
            : await reviewApi.reply(reviewId, replyComment)

        if (response.success) {
            toast.success(isUpdate ? "Reply updated" : "Reply posted")
            setReplyingTo(null)
            setReplyComment("")
            fetchReviews()
        } else {
            toast.error(response.message || "Failed to post reply")
        }
        setIsSubmitting(false)
    }

    const handleDeleteReply = async (reviewId: string) => {
        const result = await Swal.fire({
            title: 'Delete Reply?',
            text: "Are you sure you want to remove your response?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete',
            customClass: { popup: 'rounded-[1.5rem]' }
        })

        if (result.isConfirmed) {
            const response = await reviewApi.deleteReply(reviewId)
            if (response.success) {
                toast.success("Reply deleted")
                fetchReviews()
            } else {
                toast.error(response.message || "Failed to delete reply")
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

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : "0.0"

    const repliedCount = reviews.filter(r => r.isReplied).length

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">Patient Feedback</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/doctor/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium tracking-tight">Reviews & Ratings</span>
                    </nav>
                </div>
                
                {/* Statistics Box */}
                <div className="flex gap-4">
                    <div className="bg-white rounded-2xl p-4 md:px-8 shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="text-center border-r border-gray-100 pr-6">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average Rating</p>
                            <div className="flex items-center justify-center gap-2">
                                <h2 className="text-2xl font-bold text-blue-950 leading-none">{averageRating}</h2>
                                <TrendingUp size={16} className="text-emerald-500" />
                            </div>
                            <div className="flex gap-0.5 mt-2 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={cn(i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                ))}
                            </div>
                        </div>
                        {/* <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Response Rate</p>
                            <h2 className="text-2xl font-bold text-blue-950 leading-none">
                                {reviews.length > 0 ? Math.round((repliedCount / reviews.length) * 100) : 0}%
                            </h2>
                            <p className="text-[9px] font-bold border border-blue-50 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-2 inline-block">
                                {repliedCount}/{reviews.length} Replied
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200 shadow-sm">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No patient reviews yet.</p>
                        <p className="text-[10px] text-gray-400 mt-2 italic">Wait for completed consultations to receive feedback!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 flex-shrink-0">
                                            <Image 
                                                src={review.ownerId?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"} 
                                                alt="Patient" width={48} height={48} className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">{review.ownerId?.username}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(review.createdAt).toLocaleDateString()}</span>
                                                <span className="text-blue-600">AptID: {review.appointmentId?.appointmentId || review.appointmentId?._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-100/50">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                    <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                                        "{review.comment}"
                                    </p>
                                </div>

                                {/* Reply Section */}
                                <div className="pt-2">
                                    {replyingTo === review._id ? (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="relative">
                                                <textarea
                                                    value={replyComment}
                                                    onChange={(e) => setReplyComment(e.target.value)}
                                                    placeholder="Address the patient's concerns professionally..."
                                                    className="w-full h-32  text-gray-600 bg-white border-2 border-blue-50 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-blue-200 transition-all resize-none shadow-inner"
                                                />
                                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {replyComment.trim().split(/\s+/).filter(Boolean).length} / 100 words
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => setReplyingTo(null)}
                                                    className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600"
                                                >
                                                    Discard
                                                </button>
                                                <button 
                                                    onClick={() => handleReplySubmit(review._id, !!review.isReplied)}
                                                    disabled={isSubmitting || !replyComment.trim()}
                                                    className="px-8 py-2.5 bg-blue-950 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/10"
                                                >
                                                    {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                                                    {review.isReplied ? "Update Response" : "Send Response"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {review.isReplied && review.reply ? (
                                                <div className="bg-emerald-50/20 rounded-2xl p-6 border border-emerald-100/30 group relative">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                            <CheckCircle2 size={14} /> My Response
                                                            <span className="ml-2 text-gray-300 font-normal">|</span>
                                                            <span className="text-gray-400 lowercase tracking-normal ml-2">Posted {new Date(review.reply.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setReplyingTo(review._id)
                                                                    setReplyComment(review.reply.comment)
                                                                }}
                                                                className="p-2 text-blue-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100"
                                                                title="Edit Response"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteReply(review._id)}
                                                                className="p-2 text-rose-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-rose-100"
                                                                title="Delete Response"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-xs font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-4">
                                                        {review.reply.comment}
                                                    </p>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setReplyingTo(review._id)
                                                        setReplyComment("")
                                                    }}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 px-6 py-2.5 rounded-xl border border-blue-100 font-bold text-xs transition-all w-fit active:scale-95 group"
                                                >
                                                    <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                                                    Respond to Feedback
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-12">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={total}
                        entriesPerPage={4}
                    />
                </div>
            )}
        </div>
    )
}
