"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, RefreshCcw, Wallet, CreditCard, Calendar, Clock, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/utils"
import { appointmentApi } from "@/lib/api/appointment.api"
import { paymentApi } from "@/lib/api/payment.api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

function PaymentFailureContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const appointmentId = searchParams.get("id")
    const [appointment, setAppointment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRetrying, setIsRetrying] = useState(false)
    const [walletBalance, setWalletBalance] = useState<number>(0)

    useEffect(() => {
        const fetchDetails = async () => {
            if (!appointmentId) return
            setIsLoading(true)
            try {
                const [appRes, walletRes] = await Promise.all([
                    appointmentApi.getAppointmentById(appointmentId),
                    paymentApi.getWallet()
                ])
                if (appRes.success) setAppointment(appRes.data)
                if (walletRes.success) setWalletBalance(walletRes.wallet.balance)
            } catch (error) {
                console.error("Error fetching details:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetails()

        // Load Razorpay Script
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
             if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    }, [appointmentId])

    const handleRetry = async (method: "razorpay" | "wallet") => {
        if (!appointment) return
        setIsRetrying(true)

        try {
            // Check slot availability first
            const availabilityRes = await appointmentApi.checkSlotAvailability(appointment._id)
            if (!availabilityRes.success || !availabilityRes.available) {
                toast.error(availabilityRes.message || "This slot is no longer available. Please book a new slot.")
                setIsRetrying(false)
                return
            }

            if (method === "wallet") {
                if (walletBalance < appointment.totalAmount) {
                    toast.error("Insufficient wallet balance")
                    setIsRetrying(false)
                    return
                }
                const res = await paymentApi.payWithWallet({
                    amount: appointment.totalAmount,
                    appointmentId: appointment._id
                })
                if (res.success) {
                    toast.success("Payment successful!")
                    router.push(`/owner/services/${appointment.doctorId._id}/book/success?id=${appointment._id}&appId=${appointment.appointmentId}`)
                } else {
                    toast.error(res.message || "Wallet payment failed")
                }
            } else {
                const orderRes = await paymentApi.createRazorpayOrder({
                    amount: appointment.totalAmount,
                    appointmentId: appointment._id
                })

                if (!orderRes.success) {
                    toast.error("Failed to create payment order")
                    setIsRetrying(false)
                    return
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderRes.order.amount,
                    currency: orderRes.order.currency,
                    name: "TailBuddies",
                    description: "Retry Appointment Payment",
                    order_id: orderRes.order.id,
                    handler: async (response: any) => {
                        const verifyRes = await paymentApi.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            appointmentId: appointment._id
                        })

                        if (verifyRes.success) {
                            toast.success("Payment successful!")
                            router.push(`/owner/services/${appointment.doctorId._id}/book/success?id=${appointment._id}&appId=${appointment.appointmentId}`)
                        } else {
                            toast.error("Payment verification failed")
                        }
                    },
                    prefill: {
                        name: "",
                        email: "",
                        contact: ""
                    },
                    theme: {
                        color: "#2563eb"
                    },
                    modal: {
                        ondismiss: () => {
                            toast.error("Payment cancelled again")
                            setIsRetrying(false)
                        }
                    }
                }

                const rzp = new (window as any).Razorpay(options)
                rzp.open()
            }
        } catch (error) {
            console.error("Retry error:", error)
            toast.error("An error occurred during retry")
        } finally {
            setIsRetrying(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        )
    }

    const appointmentDate = appointment?.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : "TBD"

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-red-100/50 border border-red-50 overflow-hidden"
            >
                {/* Failure Header */}
                <div className="bg-amber-500 p-12 text-center relative overflow-hidden">
                    <motion.div 
                        initial={{ rotate: -15, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="relative z-10 inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6"
                    >
                        <AlertCircle size={48} className="text-amber-500" />
                    </motion.div>
                    <h1 className="relative z-10 text-3xl font-black text-white uppercase tracking-wider mb-2">Payment Failed</h1>
                    <p className="relative z-10 text-amber-50 font-bold opacity-90">We couldn't process your transaction. Please try again to secure your preferred slot.</p>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-amber-600 rounded-full blur-2xl opacity-30" />
                </div>

                <div className="p-8 md:p-12">
                    {/* Appointment Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Appointment Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Date</p>
                                        <p className="text-sm font-bold text-gray-900">{appointmentDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Time Slot</p>
                                        <p className="text-sm font-bold text-gray-900">{appointment?.appointmentStartTime || "TBD"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Patient Details</h3>
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                    <PawPrint size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{appointment?.petId?.name || "Selected Pet"}</p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{appointment?.serviceType || "Normal"} Consultation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reference ID & Amount Section */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-12 flex items-center justify-between border border-dashed border-gray-200">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Appointment Reference</p>
                            <p className="text-lg font-black text-[#002B49] tracking-widest">{appointment?.appointmentId || "PENDING"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-lg font-black text-red-600 uppercase">₹{appointment?.totalAmount}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => handleRetry("razorpay")}
                            disabled={isRetrying}
                            className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 bg-[#002B49] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#001B39] transition shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {isRetrying ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />} 
                            Retry Payment
                        </button>
                        <button 
                            onClick={() => handleRetry("wallet")}
                            disabled={isRetrying || walletBalance < (appointment?.totalAmount || 0)}
                            className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#002B49] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition border-2 border-gray-100 active:scale-[0.98] disabled:opacity-50"
                        >
                            <Wallet size={18} /> Wallet (₹{walletBalance})
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button 
                        onClick={() => router.push('/owner/bookings')}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 flex items-center gap-2"
                    >
                        <ArrowLeft size={14} /> Back to appointments
                    </button>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Need help? <span className="text-blue-500">support@tailbuddies.com</span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    )
}
