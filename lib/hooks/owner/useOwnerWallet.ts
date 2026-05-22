"use client"
import { useState, useCallback } from "react"
import { paymentApi } from "../../api/payment.api"
import { toast } from "sonner"
import type { OwnerWallet, WalletTransaction } from "@/lib/types/owner/owner.types"

export const useOwnerWallet = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isTopUpLoading, setIsTopUpLoading] = useState(false)
    const [wallet, setWallet] = useState<OwnerWallet | null>(null)
    const [transactions, setTransactions] = useState<WalletTransaction[]>([])
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const getWalletBalance = useCallback(async () => {
        try {
            const res = await paymentApi.getWallet()
            if (res.success && res.data) {
                setWallet(res.data)
                return res.data
            }
            return null
        } catch (error) {
            console.error("Error fetching wallet balance:", error)
            return null
        }
    }, [])

    const getTransactions = useCallback(async (page: number, limit: number = 5) => {
        setIsLoading(true)
        try {
            const res = await paymentApi.getTransactions(page, limit)
            if (res.success && res.data) {
                setTransactions(res.data.items || [])
                setTotalEntries(res.data.total || 0)
                setTotalPages(Math.ceil((res.data.total || 0) / limit) || 1)
                return res.data.items || []
            }
            return []
        } catch (error) {
            console.error("Error fetching transactions:", error)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createTopUpOrder = async (amount: number) => {
        setIsTopUpLoading(true)
        try {
            const orderRes = await paymentApi.createRazorpayOrder({
                amount,
                appointmentId: "topup"
            })
            if (orderRes.success) {
                return orderRes.data
            } else {
                toast.error(orderRes.message || "Failed to initiate top-up")
                return null
            }
        } catch (error) {
            console.error("Top-up order error:", error)
            toast.error("An error occurred during top-up")
            return null
        } finally {
            setIsTopUpLoading(false)
        }
    }

    const verifyTopUpPayment = async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => {
        setIsTopUpLoading(true)
        try {
            const verifyRes = await paymentApi.verifyRazorpayPayment({
                ...data,
                appointmentId: "topup"
            })
            if (verifyRes.success) {
                toast.success("Wallet topped up successfully!")
                await getWalletBalance()
                await getTransactions(1)
                return true
            } else {
                toast.error(verifyRes.message || "Verification failed. Please contact support.")
                return false
            }
        } catch (error) {
            console.error("Verification error:", error)
            toast.error("An error occurred during verification")
            return false
        } finally {
            setIsTopUpLoading(false)
        }
    }

    return {
        wallet,
        transactions,
        totalEntries,
        totalPages,
        isLoading,
        isTopUpLoading,
        setIsTopUpLoading,
        getWalletBalance,
        getTransactions,
        createTopUpOrder,
        verifyTopUpPayment,
    }
}
