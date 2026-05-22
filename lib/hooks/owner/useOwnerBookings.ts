"use client"
import { useState, useCallback } from "react"
import { appointmentApi } from "../../api/appointment.api"
import { paymentApi } from "../../api/payment.api"
import { toast } from "sonner"
import type { OwnerAppointment, OwnerAppointmentStats } from "@/lib/types/owner/owner.types"

export const useOwnerBookings = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [appointments, setAppointments] = useState<OwnerAppointment[]>([])
    const [appointment, setAppointment] = useState<OwnerAppointment | null>(null)
    const [allStats, setAllStats] = useState<OwnerAppointmentStats | null>(null)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const getOwnerStats = useCallback(async () => {
        try {
            const response = await appointmentApi.getOwnerStats()
            if (response.success && response.data) {
                setAllStats(response.data)
                return response.data
            }
            return null
        } catch (error) {
            console.error("Failed to fetch owner stats:", error)
            return null
        }
    }, [])

    const getOwnerAppointments = useCallback(async (
        page: number, 
        limit: number = 10, 
        search: string = "", 
        status: string = "",
        timeframe: string = "",
        pet: string = ""
    ) => {
        setIsLoading(true)
        try {
            const response = await appointmentApi.getOwnerAppointments(page, limit, search, status, timeframe, pet)
            if (response.success && response.data) {
                const items = response.data.items || (Array.isArray(response.data) ? response.data : [])
                const total = response.data.total || (Array.isArray(response.data) ? response.data.length : 0)
                setAppointments(items)
                setTotalEntries(total)
                setTotalPages(Math.ceil(total / limit) || 1)
                return items
            }
            return []
        } catch (error) {
            console.error("Failed to fetch appointments:", error)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getAppointmentById = useCallback(async (id: string) => {
        setIsLoading(true)
        try {
            const response = await appointmentApi.getAppointmentById(id)
            if (response.success && response.data) {
                setAppointment(response.data as OwnerAppointment)
                return response.data as OwnerAppointment
            } else {
                toast.error(response.message || "Failed to fetch appointment details")
                return null
            }
        } catch (error) {
            console.error("Failed to fetch appointment details:", error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createAppointment = useCallback(async (data: unknown, options?: { silent?: boolean }) => {
        setIsSubmitting(true)
        try {
            const response = await appointmentApi.create(data)
            if (response.success && response.data) {
                if (!options?.silent) {
                    toast.success("Appointment booked successfully")
                }
                return response.data
            } else {
                toast.error(response.message || "Failed to book appointment")
                return null
            }
        } catch (error) {
            console.error("Failed to create appointment:", error)
            return null
        } finally {
            setIsSubmitting(false)
        }
    }, [])

    const cancelAppointment = async (id: string, reason: string) => {
        setIsSubmitting(true)
        try {
            const response = await appointmentApi.cancel(id, reason)
            if (response.success) {
                toast.success("Appointment cancelled successfully")
                if (appointment && appointment._id === id) {
                    setAppointment({ ...appointment, status: "cancelled" })
                }
                return true
            } else {
                toast.error(response.message || "Failed to cancel appointment")
                return false
            }
        } catch (error) {
            console.error("Failed to cancel appointment:", error)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelPendingAppointment = async (id: string) => {
        setIsSubmitting(true)
        try {
            const response = await appointmentApi.cancelPendingAppointment(id)
            if (response.success) {
                toast.success("Pending appointment cancelled")
                return true
            } else {
                toast.error(response.message || "Failed to cancel pending appointment")
                return false
            }
        } catch (error) {
            console.error("Failed to cancel pending appointment:", error)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const checkSlotAvailability = async (id: string) => {
        try {
            const response = await appointmentApi.checkSlotAvailability(id)
            return response
        } catch (error) {
            console.error("Failed to check slot availability:", error)
            return { success: false, message: "Error checking slot" }
        }
    }

    const checkIn = async (id: string, role: "owner" | "doctor") => {
        try {
            const response = await appointmentApi.checkIn(id, role)
            if (response.success) {
                toast.success("Checked in successfully")
                if (appointment && appointment._id === id) {
                    const newCheckIn = { ...appointment.checkIn, [`${role}CheckInTime`]: new Date().toISOString() }
                    setAppointment({ ...appointment, checkIn: newCheckIn })
                }
                return true
            } else {
                toast.error(response.message || "Check-in failed")
                return false
            }
        } catch (error) {
            console.error("Failed check-in:", error)
            return false
        }
    }

    const checkOut = async (id: string, role: "owner" | "doctor") => {
        try {
            const response = await appointmentApi.checkOut(id, role)
            if (response.success) {
                toast.success("Checked out successfully")
                if (appointment && appointment._id === id) {
                    const newCheckOut = { ...appointment.checkOut, [`${role}CheckOutTime`]: new Date().toISOString() }
                    setAppointment({ ...appointment, checkOut: newCheckOut, status: "completed" })
                }
                return true
            } else {
                toast.error(response.message || "Check-out failed")
                return false
            }
        } catch (error) {
            console.error("Failed check-out:", error)
            return false
        }
    }

    // Payments delegation
    const payWithWallet = async (amount: number, appointmentId: string) => {
        setIsSubmitting(true)
        try {
            const response = await paymentApi.payWithWallet({ amount, appointmentId })
            if (response.success) {
                toast.success("Paid successfully using wallet")
                return response
            } else {
                toast.error(response.message || "Failed to pay with wallet")
                return response
            }
        } catch (error) {
            console.error("Payment error:", error)
            return { success: false, message: "An error occurred during wallet payment" }
        } finally {
            setIsSubmitting(false)
        }
    }

    const createRazorpayOrder = async (amount: number, appointmentId: string) => {
        setIsSubmitting(true)
        try {
            const response = await paymentApi.createRazorpayOrder({ amount, appointmentId })
            return response
        } catch (error) {
            console.error("Failed to create Razorpay order:", error)
            return { success: false, message: "An error occurred creating payment order" }
        } finally {
            setIsSubmitting(false)
        }
    }

    const verifyRazorpayPayment = async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        appointmentId: string;
    }) => {
        setIsSubmitting(true)
        try {
            const response = await paymentApi.verifyRazorpayPayment(data)
            return response
        } catch (error) {
            console.error("Failed to verify Razorpay payment:", error)
            return { success: false, message: "An error occurred during verification" }
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        appointments,
        appointment,
        allStats,
        isLoading,
        isSubmitting,
        totalEntries,
        totalPages,
        getOwnerStats,
        getOwnerAppointments,
        getAppointmentById,
        createAppointment,
        cancelAppointment,
        cancelPendingAppointment,
        checkSlotAvailability,
        checkIn,
        checkOut,
        payWithWallet,
        createRazorpayOrder,
        verifyRazorpayPayment,
    }
}
