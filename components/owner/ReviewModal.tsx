"use client"

import { useState, useEffect } from 'react'
import { Star, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { reviewApi } from '@/lib/api/review.api'
import { toast } from 'sonner'

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    appointmentId: string
    existingReview?: any
    onSuccess: () => void
}

export const ReviewModal = ({ isOpen, onClose, appointmentId, existingReview, onSuccess }: ReviewModalProps) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [wordCount, setWordCount] = useState(0)

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating || 0)
            setComment(existingReview.comment || '')
        } else {
            setRating(0)
            setComment('')
        }
    }, [existingReview, isOpen])

    useEffect(() => {
        const count = comment.trim().split(/\s+/).filter(Boolean).length
        setWordCount(count)
    }, [comment])

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating")
            return
        }

        if (wordCount > 100) {
            toast.error("Comment cannot exceed 100 words")
            return
        }

        setIsSubmitting(true)
        const response = existingReview 
            ? await reviewApi.update(existingReview._id, { rating, comment })
            : await reviewApi.create({ appointmentId, rating, comment })

        if (response.success) {
            toast.success(existingReview ? "Review updated" : "Review submitted")
            onSuccess()
            onClose()
        } else {
            toast.error(response.message || "Failed to submit review")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-blue-50/50 animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div>
                        <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">
                            {existingReview ? "Edit Your Review" : "Rate Your Experience"}
                        </h3>
                        <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest mt-1">Share your feedback about the consultation</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group border border-transparent hover:border-gray-100"
                    >
                        <X size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    {/* Star Rating Section */}
                    <div className="flex flex-col items-center gap-4 py-4 bg-blue-50/30 rounded-3xl border border-blue-50/50">
                        <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Overall Rating *</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1.5 transition-all active:scale-90"
                                >
                                    <Star
                                        size={42}
                                        className={cn(
                                            "transition-all duration-300",
                                            (hoverRating || rating) >= star 
                                                ? "fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" 
                                                : "text-gray-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] font-bold text-blue-600/80 uppercase tracking-widest">
                            {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : rating === 1 ? "Poor" : "Select Stars"}
                        </p>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Your Feedback (Optional)</label>
                            <span className={cn(
                                "text-[10px] font-bold tracking-widest uppercase",
                                wordCount > 100 ? "text-red-500" : "text-blue-600/40"
                            )}>
                                {wordCount} / 100 Words
                            </span>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your consultation experience..."
                            className={cn(
                                "w-full h-40 bg-gray-50 border-2 rounded-3xl p-6 text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-gray-300",
                                wordCount > 100 
                                    ? "border-red-100 focus:border-red-200 text-red-600" 
                                    : "border-gray-50 focus:border-blue-100 focus:bg-white text-gray-700"
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 border border-gray-100"
                        >
                            Later
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0 || wordCount > 100}
                            className="flex-2 flex-[2] bg-[#002B49] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-950 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : null}
                            {existingReview ? "Update Review" : "Submit Feedback"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
