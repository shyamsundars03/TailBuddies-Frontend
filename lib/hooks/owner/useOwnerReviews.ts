"use client"
import { useState, useCallback } from "react"
import { reviewApi } from "../../api/review.api"
import { toast } from "sonner"
import type { Review } from "@/lib/types/owner/owner.types"

export const useOwnerReviews = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [reviews, setReviews] = useState<Review[]>([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const getReviews = useCallback(async (page: number = 1, limit: number = 3, search: string = "") => {
        setIsLoading(true)
        try {
            const response = await reviewApi.getOwnerReviews(page, limit, search)
            if (response.success && response.data) {
                setReviews(response.data.items || [])
                const totalCount = response.data.total ?? 0
                setTotal(totalCount)
                setTotalPages(Math.max(1, Math.ceil(totalCount / limit)))
                return response.data.items || []
            } else {
                toast.error(response.message || "Failed to fetch reviews")
                return []
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createReview = async (appointmentId: string, rating: number, comment?: string) => {
        setIsLoading(true)
        try {
            const response = await reviewApi.create({ appointmentId, rating, comment })
            if (response.success) {
                toast.success("Review submitted successfully")
                return true
            } else {
                toast.error(response.message || "Failed to submit review")
                return false
            }
        } catch {
            toast.error("An error occurred while submitting review")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateReview = async (id: string, rating: number, comment?: string) => {
        setIsLoading(true)
        try {
            const response = await reviewApi.update(id, { rating, comment })
            if (response.success) {
                toast.success("Review updated successfully")
                return true
            } else {
                toast.error(response.message || "Failed to update review")
                return false
            }
        } catch {
            toast.error("An error occurred while updating review")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteReview = async (id: string) => {
        setIsLoading(true)
        try {
            const response = await reviewApi.delete(id)
            if (response.success) {
                toast.success("Review deleted successfully")
                return true
            } else {
                toast.error(response.message || "Failed to delete review")
                return false
            }
        } catch {
            toast.error("An error occurred while deleting review")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        reviews,
        total,
        totalPages,
        isLoading,
        getReviews,
        createReview,
        updateReview,
        deleteReview,
    }
}
