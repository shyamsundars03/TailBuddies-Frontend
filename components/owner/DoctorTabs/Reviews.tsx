"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { reviewApi } from "@/lib/api/review.api"
import { format } from "date-fns"
import type { DoctorReview } from "@/lib/types/owner/owner.types"

type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>

const EMPTY_DISTRIBUTION: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

interface ReviewItemProps {
    user: string
    date: string
    rating: number
    comment: string
    reply: { doctor: string; date: string; text: string } | null
}

export function Reviews({
    doctorId,
    averageRating,
    reviewCount,
}: {
    doctorId: string
    averageRating?: number
    reviewCount?: number
}) {
    const [reviews, setReviews] = useState<DoctorReview[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<{
        average: number
        distribution: RatingDistribution
    }>({
        average: averageRating ?? 0,
        distribution: EMPTY_DISTRIBUTION
    })

    const fetchReviews = useCallback(async () => {
        setIsLoading(true)
        const response = await reviewApi.getByDoctorId(doctorId, page, 10)
        if (response.success) {
            const items = (response.data?.items || []) as DoctorReview[]
            setReviews(items)
            setTotal(response.data?.total ?? reviewCount ?? 0)

            if (items.length > 0) {
                const distribution = items.reduce<RatingDistribution>((acc, rev) => {
                    const rating = rev.rating as keyof RatingDistribution
                    if (rating >= 1 && rating <= 5) {
                        acc[rating] = (acc[rating] || 0) + 1
                    }
                    return acc
                }, { ...EMPTY_DISTRIBUTION })
                
                const avg = items.reduce((acc, rev) => acc + rev.rating, 0) / items.length
                setStats({ average: avg, distribution })
            } else if ((averageRating ?? 0) > 0) {
                setStats((prev) => ({ ...prev, average: averageRating ?? 0 }))
            }
        }
        setIsLoading(false)
    }, [doctorId, page, reviewCount, averageRating])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    useEffect(() => {
        if ((averageRating ?? 0) > 0) {
            setStats((prev) => ({ ...prev, average: averageRating ?? prev.average }))
        }
    }, [averageRating])

    if (isLoading && page === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Reviews...</p>
            </div>
        )
    }

    if (!isLoading && reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Yet to be rated</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center gap-10 bg-blue-50/30 rounded-3xl p-8 border border-blue-100/50">
                <div className="text-center space-y-2">
                    <p className="text-4xl font-black text-blue-950">{stats.average.toFixed(1)}</p>
                    <div className="flex gap-0.5 justify-center">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star 
                                key={i} 
                                size={14} 
                                className={cn(i <= Math.round(stats.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} 
                            />
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Rating</p>
                </div>

                <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map(star => {
                        const percentage = reviews.length > 0 ? (stats.distribution[star as keyof typeof stats.distribution] / reviews.length) * 100 : 0
                        return (
                            <div key={star} className="flex items-center gap-4 group">
                                <span className="text-[10px] font-black text-blue-950 w-2 uppercase">{star}</span>
                                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000 group-hover:bg-blue-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 w-8 text-right uppercase">{Math.round(percentage)}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-6">
                {(reviews || []).map((review) => (
                    <ReviewItem
                        key={review._id}
                        user={review.ownerId?.username || "Verified Owner"}
                        date={review.createdAt ? format(new Date(review.createdAt), "dd MMM yyyy") : "N/A"}
                        rating={review.rating}
                        comment={review.comment}
                        reply={review.isReplied ? {
                            doctor: review.doctorId?.userId?.username || "Doctor",
                            date: (review.reply?.updatedAt || review.reply?.createdAt) 
                                ? format(new Date(review.reply?.updatedAt || review.reply?.createdAt), "dd MMM yyyy") 
                                : "N/A",
                            text: review.reply?.comment ?? ""
                        } : null}
                    />
                ))}
            </div>

            {total > reviews.length && (
                <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoading}
                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                >
                    {isLoading ? "Loading..." : "Show More Reviews"}
                </button>
            )}
        </div>
    )
}

function ReviewItem({ user, date, rating, comment, reply }: ReviewItemProps) {
    return (
        <div className="bg-white border border-gray-50 rounded-3xl p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500 group">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-black text-lg shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                        {user[0]}
                    </div>
                    <div>
                        <h4 className="font-black text-blue-950 text-sm uppercase tracking-tight">{user}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star
                            key={i}
                            size={14}
                            className={cn(i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100")}
                        />
                    ))}
                </div>
            </div>

            <p className="text-gray-500 text-xs font-medium leading-relaxed italic">&quot;{comment}&quot;</p>

            {reply && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                            {reply.doctor[0]}
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-blue-900 uppercase">{reply.doctor}</h5>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{reply.date}</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{reply.text}</p>
                </div>
            )}
        </div>
    )
}
