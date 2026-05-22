import { useEffect, useState, useCallback } from "react"
import { Check, Wallet, CreditCard, Banknote, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { useRouter } from "next/navigation"
import { useOwnerServices } from "@/lib/hooks/owner/useOwnerServices"
import { useOwnerPets } from "@/lib/hooks/owner/useOwnerPets"
import { useOwnerWallet } from "@/lib/hooks/owner/useOwnerWallet"
import { useOwnerBookings } from "@/lib/hooks/owner/useOwnerBookings"
import { useRazorpay } from "@/lib/hooks/useRazorpay"
import { OWNER_ROUTES } from "@/lib/constants/routes"
import { toast } from "sonner"

interface BookingData {
    type: string;
    petId: string;
    problemDescription: string;
    symptoms: string[];
    date: string;
    rawDate: string;
    time: string;
    slotId: string;
    mode: string;
    paymentMethod: string;
}

interface DoctorSummary {
    _id: string;
    userId?: { username?: string; profilePic?: string };
    profile?: {
        specialtyId?: { name?: string };
        designation?: string;
        consultationFees?: number;
        experienceYears?: number;
    };
    clinicInfo?: {
        clinicName?: string;
        address?: {
            doorNo?: string;
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
        };
    };
    isActive?: boolean;
    isVerified?: boolean;
}

interface PetSummary {
    _id: string;
    name?: string;
    species?: string;
    ownerName?: string;
}

interface AppointmentResult {
    _id: string;
    appointmentId: string;
}

interface SummaryPaymentStepProps {
    data: BookingData;
    doctorId: string;
    onRegisterTrigger?: (fn: () => void) => void;
}

interface PaymentOptionProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    subLabel?: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    showWarning?: boolean;
}

export function SummaryPaymentStep({ data, doctorId, onRegisterTrigger }: SummaryPaymentStepProps) {
    const router = useRouter()
    const [doctor, setDoctor] = useState<DoctorSummary | null>(null)
    const [pet, setPet] = useState<PetSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isBooking, setIsBooking] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay" | "Wallet">("COD")

    const { getDoctorById } = useOwnerServices()
    const { getPetDetails } = useOwnerPets()
    const { wallet, getWalletBalance } = useOwnerWallet()
    const { createAppointment, payWithWallet, createRazorpayOrder, verifyRazorpayPayment } = useOwnerBookings()
    const { openRazorpay } = useRazorpay()

    const walletBalance = wallet?.balance || 0

    useEffect(() => {
        if (data.mode === 'online' && paymentMethod === 'COD') {
            setPaymentMethod('Razorpay')
        }
    }, [data.mode, paymentMethod])

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true)
            try {
                const [docRes, petRes] = await Promise.all([
                    getDoctorById(doctorId),
                    data.petId ? getPetDetails(data.petId) : Promise.resolve(null)
                ])

                if (docRes) setDoctor(docRes as DoctorSummary)
                if (petRes) setPet(petRes)

                // Fetch wallet balance
                await getWalletBalance()
            } catch (error) {
                console.error("Error fetching details:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetails()
    }, [doctorId, data.petId, getDoctorById, getPetDetails, getWalletBalance])

    const finalizeBooking = useCallback((appointment: AppointmentResult) => {
        const summaryData = {
            date: data.date,
            timeSlot: data.time,
            petName: pet?.name || 'Your Pet',
            appointmentType: data.type
        }
        sessionStorage.setItem("bookingData", JSON.stringify(summaryData))
        sessionStorage.setItem(`booking_completed_${doctorId}`, 'true')

        sessionStorage.removeItem(`booking_${doctorId}`)
        sessionStorage.removeItem(`booking_step_${doctorId}`)
        router.push(OWNER_ROUTES.BOOKING_SUCCESS(doctorId, appointment._id, appointment.appointmentId))
    }, [data, doctorId, pet, router])

    const handleRazorpayPayment = useCallback(async (appointment: AppointmentResult, amount: number) => {
        try {
            const orderRes = await createRazorpayOrder(amount, appointment._id)

            if (!orderRes.success) {
                toast.error(orderRes.message || "Failed to create payment order")
                setIsBooking(false)
                return
            }

            const order = orderRes.data?.order
            if (!order) {
                toast.error("Failed to create payment order")
                setIsBooking(false)
                return
            }

            openRazorpay({
                amount: order.amount,
                currency: order.currency,
                name: "TailBuddies",
                description: "Appointment Consultation Fee",
                order_id: order.id,
                onSuccess: async (response) => {
                    try {
                        const verifyRes = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            appointmentId: appointment._id
                        })

                        if (verifyRes.success) {
                            toast.success("Payment successful!")
                            finalizeBooking(appointment)
                        } else {
                            toast.error(verifyRes.message || "Payment verification failed")
                            router.push(OWNER_ROUTES.PAYMENT_FAILURE(appointment._id))
                        }
                    } catch (err: unknown) {
                        console.error("Verification error:", err)
                        toast.error("An error occurred during verification")
                        router.push(OWNER_ROUTES.PAYMENT_FAILURE(appointment._id))
                    }
                },
                prefill: {
                    name: pet?.ownerName || "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled")
                        setIsBooking(false)
                        router.push(OWNER_ROUTES.PAYMENT_FAILURE(appointment._id))
                    }
                }
            })
        } catch (error) {
            console.error("Razorpay error:", error)
            toast.error("Razorpay integration failed")
            setIsBooking(false)
        }
    }, [createRazorpayOrder, openRazorpay, verifyRazorpayPayment, finalizeBooking, pet, router])

    const handleWalletPayment = useCallback(async (appointment: AppointmentResult, amount: number) => {
        try {
            if (walletBalance < amount) {
                toast.error("Insufficient wallet balance")
                setIsBooking(false)
                return
            }

            const response = await payWithWallet(amount, appointment._id)

            if (response.success) {
                finalizeBooking(appointment)
            } else {
                router.push(OWNER_ROUTES.PAYMENT_FAILURE(appointment._id))
            }
        } catch (error) {
            console.error("Wallet payment error:", error)
            toast.error("Wallet payment failed")
            setIsBooking(false)
        }
    }, [finalizeBooking, walletBalance, payWithWallet, router])

    const handleBooking = useCallback(async () => {
        if (!data.slotId || !data.petId) {
            toast.error("Required booking information is missing")
            return
        }

        setIsBooking(true)
        try {
            const amount = doctor?.profile?.consultationFees || 400
            const bookingPayload = {
                doctorId,
                petId: data.petId,
                slotId: data.slotId,
                serviceType: data.type,
                problemDescription: data.problemDescription,
                symptoms: data.symptoms,
                appointmentDate: data.rawDate,
                appointmentStartTime: data.time.split(' - ')[0],
                appointmentEndTime: data.time.split(' - ')[1],
                mode: data.mode || 'offline',
                paymentMethod: paymentMethod.toLowerCase(),
                totalAmount: amount
            }

            const response = await createAppointment(bookingPayload, { silent: paymentMethod === 'Razorpay' })

            if (!response) {
                setIsBooking(false)
                return
            }

            const appointment = response as AppointmentResult

            if (paymentMethod === "COD") {
                finalizeBooking(appointment)
            } else if (paymentMethod === "Razorpay") {
                await handleRazorpayPayment(appointment, amount)
            } else if (paymentMethod === "Wallet") {
                await handleWalletPayment(appointment, amount)
            }

        } catch (error: unknown) {
            console.error("Booking error caught:", error)
            toast.error("An unexpected error occurred. Please try again.")
            setIsBooking(false)
        }
    }, [data, doctor, doctorId, paymentMethod, finalizeBooking, handleRazorpayPayment, handleWalletPayment, createAppointment])

    // Register the booking trigger callback with the parent stepper
    useEffect(() => {
        if (onRegisterTrigger) {
            onRegisterTrigger(handleBooking)
        }
    }, [handleBooking, onRegisterTrigger])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preparing Summary...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-gray-50/50 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-blue-950 uppercase tracking-widest border-b border-gray-100 pb-4">Summary</h3>
                        <div className="space-y-2 text-xs font-semibold text-gray-500">
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Context:</span>
                                <span className="text-blue-900 font-bold">{doctor?.userId?.username || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Pet:</span>
                                <span className="text-blue-900 font-bold">{pet?.name || "N/A"} ({pet?.species || "Species N/A"})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Date:</span>
                                <span className="text-blue-900 font-bold">{data.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Time:</span>
                                <span className="text-blue-900 font-bold">{data.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Mode:</span>
                                <span className="text-blue-900 font-bold capitalize">{data.mode || "offline"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-[10px]">Service:</span>
                                <span className="text-blue-900 font-bold">{data.type}</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <span className="uppercase text-[10px] shrink-0">Location:</span>
                                <span className="text-blue-900 font-bold text-right">
                                    {doctor?.clinicInfo?.clinicName}<br />
                                    {doctor?.clinicInfo?.address?.doorNo} {doctor?.clinicInfo?.address?.street},<br />
                                    {doctor?.clinicInfo?.address?.city}, {doctor?.clinicInfo?.address?.state} - {doctor?.clinicInfo?.address?.pincode}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-md space-y-6">
                        <h3 className="text-sm font-bold text-blue-950 uppercase tracking-widest border-b border-gray-100 pb-4">Price Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Consultation Fee</span>
                                <span className="text-lg font-bold text-blue-900">₹{doctor?.profile?.consultationFees || 400}</span>
                            </div>
                            <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-black text-blue-950 uppercase tracking-[0.2em]">Total</span>
                                <span className="text-2xl font-black text-blue-600">₹{doctor?.profile?.consultationFees || 400}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-lg p-8 space-y-8">
                <h3 className="text-center text-[10px] font-black text-blue-950 uppercase tracking-[0.2em]">Select Payment Method</h3>
                <div className="space-y-6">
                    <PaymentOption
                        id="Razorpay"
                        icon={<CreditCard className="text-blue-600" size={20} />}
                        label="Pay with Razorpay"
                        subLabel="Secure online payment"
                        selected={paymentMethod === "Razorpay"}
                        onClick={() => setPaymentMethod("Razorpay")}
                    />
                    <PaymentOption
                        id="Wallet"
                        icon={<Wallet className={cn("text-blue-600", walletBalance < (doctor?.profile?.consultationFees || 400) && "text-red-400")} size={20} />}
                        label={`Wallet (₹${walletBalance})`}
                        subLabel={walletBalance < (doctor?.profile?.consultationFees || 400) ? "Insufficient balance to book" : "Pay from your wallet"}
                        selected={paymentMethod === "Wallet"}
                        onClick={() => setPaymentMethod("Wallet")}
                        disabled={walletBalance < (doctor?.profile?.consultationFees || 400)}
                        showWarning={walletBalance < (doctor?.profile?.consultationFees || 400)}
                    />
                    <PaymentOption
                        id="COD"
                        icon={<Banknote className={cn("text-emerald-500", data.mode === 'online' && "text-gray-400")} size={20} />}
                        label="Cash on Consultation"
                        subLabel={data.mode === 'online' ? "Not available for online consultations" : "Proceed with booking and pay at clinic"}
                        selected={paymentMethod === "COD"}
                        onClick={() => setPaymentMethod("COD")}
                        disabled={data.mode === 'online'}
                    />
                </div>
            </div>
            {isBooking && (
                <div className="fixed inset-0 bg-[#002B49]/10 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/20 border border-blue-50 flex flex-col items-center max-w-sm w-full mx-4 relative overflow-hidden">
                        {/* Decorative Background for Loader */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50" />

                        <div className="relative mb-8">
                            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                            <Check className="absolute inset-0 m-auto text-blue-600 opacity-20" size={32} />
                        </div>

                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.3em] mb-3">Processing</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                            Securing your appointment slot. <br /> Please do not refresh the page.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

function PaymentOption({ id: _id, icon, label, subLabel, selected, onClick, disabled, showWarning }: PaymentOptionProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300",
                selected
                    ? "border-blue-500 bg-blue-50/10 shadow-sm"
                    : disabled
                        ? "border-gray-50 bg-gray-50/50 cursor-not-allowed opacity-60"
                        : "border-gray-50 bg-white hover:border-blue-100"
            )}
        >
            <div className="flex items-center gap-4 text-left">
                <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    selected ? "bg-blue-600 border-blue-600" : "border-gray-200"
                )}>
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        {icon}
                        <span className={cn(
                            "text-sm font-bold uppercase tracking-wider",
                            selected ? "text-blue-900" : "text-gray-500"
                        )}>{label}</span>
                    </div>
                    {subLabel && (
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-1 ml-8",
                            showWarning ? "text-red-500 animate-pulse" : "text-gray-400"
                        )}>{subLabel}</p>
                    )}
                </div>
            </div>
            {selected && <Check size={18} className="text-blue-600" />}
        </button>
    )
}
