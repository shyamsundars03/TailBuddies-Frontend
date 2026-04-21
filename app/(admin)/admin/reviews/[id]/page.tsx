"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, Trash2, Loader2, ChevronLeft, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"
import { reviewApi } from "@/lib/api/review.api"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { AdminPageContainer } from "../../../../../components/common/layout/admin/PageContainer"

export default function AdminReviewDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [review, setReview] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchReview = useCallback(async () => {
        if (!params.id) return
        setIsLoading(true)
        const response = await reviewApi.getById(params.id as string)
        if (response.success) {
            setReview(response.data)
        } else {
            toast.error(response.message || "Failed to fetch review details")
            router.push('/admin/reviews')
        }
        setIsLoading(false)
    }, [params.id, router])

    useEffect(() => {
        fetchReview()
    }, [fetchReview])

    const handleDeleteReview = async () => {
        const result = await Swal.fire({
            title: 'Delete Entire Review?',
            text: "This will remove the review and the associated doctor reply permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete All',
            customClass: { popup: 'rounded-[1rem]' }
        })

        if (result.isConfirmed) {
            const response = await reviewApi.delete(review._id)
            if (response.success) {
                toast.success("Review deleted successfully")
                router.push('/admin/reviews')
            } else {
                toast.error(response.message || "Failed to delete review")
            }
        }
    }

    const handleDeleteReply = async () => {
        const result = await Swal.fire({
            title: 'Delete Doctor Reply?',
            text: "This will remove only the doctor's response. The patient's review will remain.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete Reply',
            customClass: { popup: 'rounded-[1rem]' }
        })

        if (result.isConfirmed) {
            const response = await reviewApi.deleteReply(review._id)
            if (response.success) {
                toast.success("Doctor's reply removed")
                fetchReview()
            } else {
                toast.error(response.message || "Failed to delete reply")
            }
        }
    }

    if (isLoading) {
        return (
            <AdminPageContainer title="Review Details" activeItem="reviews">
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading review details...</p>
                </div>
            </AdminPageContainer>
        )
    }

    if (!review) return null

console.log("sdvs",review)

    return (
        <AdminPageContainer title="Review Moderation" activeItem="reviews">
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-[#333333] mb-1">Moderate Feedback</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                            <span>/</span>
                            <Link href="/admin/reviews" className="text-blue-600 hover:underline">Reviews</Link>
                            <span>/</span>
                            <span className="text-gray-400">Moderation</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition shadow-md active:scale-95"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-10">
                        {/* Reviewer Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-blue-50">
                                    <Image 
                                        src={review.ownerId?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"} 
                                        alt="Reviewer" width={64} height={64} className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{review.ownerId?.username} (Patient)</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-[11px] font-bold">
                                        <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1.5">
                                            AptID: {review.appointmentId?.appointmentId || review.appointmentId?._id?.slice(-8).toUpperCase() || 'N/A'}
                                        </span>
                                        <span className="text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                            <div className="w-5 h-5 rounded-md overflow-hidden bg-white shadow-sm border border-emerald-100">
                                                <Image 
                                                    src={review.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                                                    alt="Doctor" width={20} height={20} className="w-full h-full object-cover"
                                                />
                                            </div>
                                            For Dr. {review.doctorId?.userId?.username || 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1 bg-amber-50 rounded-xl px-4 py-2 border border-amber-100">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                ))}
                            </div>
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-8">
                            {/* Patient Review */}
                            <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4">Patient Review</label>
                                <p className="text-gray-700 text-lg font-medium leading-relaxed italic">
                                    "{review.comment}"
                                </p>
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={handleDeleteReview}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all border border-rose-100 active:scale-95"
                                    >
                                        <Trash2 size={14} /> Delete Entire Review
                                    </button>
                                </div>
                            </div>

                            {/* Doctor Reply */}
                            {review.isReplied && review.reply ? (
                                <div className="ml-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white bg-white">
                                                <Image 
                                                    src={review.doctorId?.userId?.profilePic || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150"} 
                                                    alt="Doctor" width={40} height={40} className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-900 tracking-tight">Dr. {review.doctorId?.userId?.username}</h4>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                    Replied on {new Date(review.reply.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleDeleteReply}
                                            className="p-2 bg-white text-rose-500 hover:bg-rose-50 rounded-lg transition-all shadow-sm border border-gray-100"
                                            title="Delete only doctor reply"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed italic pl-4 border-l-4 border-gray-200">
                                        {review.reply.comment}
                                    </p>
                                </div>
                            ) : (
                                <div className="ml-8 p-6 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No doctor response to moderate</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    )
}

