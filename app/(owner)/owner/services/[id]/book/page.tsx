"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Star, MapPin } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

// Step Components (will be defined in separate files or inline for now)
import { AppointmentTypeStep } from "./components/AppointmentTypeStep"
import { PetSelectionStep } from "./components/PetSelectionStep"
import { DateTimeStep } from "./components/DateTimeStep"
import { SummaryPaymentStep } from "./components/SummaryPaymentStep"

const STEPS = [
    { id: 1, name: "Appointment Type" },
    { id: 2, name: "Pet" },
    { id: 3, name: "Date & Time" },
    { id: 4, name: "Final Summary" }
]

export default function AppointmentBookingPage() {
    const params = useParams()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)

    // Booking State
    const [bookingData, setBookingData] = useState({
        type: "Normal",
        petId: "",
        problemDescription: "",
        symptoms: [] as string[],
        date: "11 Nov 2025",
        time: "10:00 AM",
        paymentMethod: "Razerpay"
    })

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    return (
        <div className="min-h-screen bg-gray-50/30 -mt-8 -mx-8 p-8">
            <div className="max-w-5xl mx-auto space-y-8 relative">
                {/* Top Back Button (Only for Step 1) */}
                {currentStep === 1 && (
                    <button
                        onClick={() => router.push(`/owner/services/${params.id}`)}
                        className="
    px-5 py-2
    bg-blue-600
    text-white
    text-sm
    font-semibold
    rounded-lg
    shadow-sm
    hover:bg-blue-700
    transition-colors duration-200
    mb-6
  "
                    >
                        Back
                    </button>
                    // <button
                    //     onClick={() => router.push(`/owner/services/${params.id}`)}
                    //     className="absolute right-0 -top-2 flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group z-10"
                    // >
                    //     <span className="text-[10px] font-bold uppercase tracking-widest">Back to Profile</span>
                    //     <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
                    //         <ChevronRight size={18} className="rotate-180" />
                    //     </div>
                    // </button>
                )}

                {/* Stepper */}
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                                        currentStep === step.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                                            : currentStep > step.id
                                                ? "bg-emerald-500 text-white"
                                                : "bg-white border border-gray-200 text-gray-400"
                                    )}>
                                        {currentStep > step.id ? <Check size={16} /> : step.id}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest",
                                        currentStep >= step.id ? "text-blue-900" : "text-gray-400"
                                    )}>
                                        {step.name}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={cn(
                                        "w-16 h-[2px] mx-4 -mt-6 transition-colors duration-500",
                                        currentStep > step.id ? "bg-emerald-500" : "bg-gray-200"
                                    )}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Doctor Selection Preview (Fixed at top) */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm">
                        <Image
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"
                            alt="Doctor"
                            width={64}
                            height={64}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-blue-950">Dr. Michael Brown</h3>
                            <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                <Star size={10} className="fill-white" />
                                5.0
                            </div>
                        </div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Psychologist</p>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                            <MapPin size={12} className="text-gray-300" />
                            <p className="text-[10px] font-semibold">5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-lg min-h-[400px] flex flex-col">
                    <div className="flex-1 p-8 lg:p-10">
                        {currentStep === 1 && <AppointmentTypeStep data={bookingData} setData={setBookingData} />}
                        {currentStep === 2 && <PetSelectionStep data={bookingData} setData={setBookingData} />}
                        {currentStep === 3 && <DateTimeStep data={bookingData} setData={setBookingData} />}
                        {currentStep === 4 && <SummaryPaymentStep data={bookingData} doctorId={params.id as string} />}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all",
                                currentStep === 1
                                    ? "opacity-0 pointer-events-none"
                                    : "bg-blue-950 text-white hover:bg-blue-900 active:scale-95 shadow-lg shadow-blue-900/20"
                            )}
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                            >
                                {currentStep === 1 ? "Select Pet" : currentStep === 2 ? "Select Date & Time" : "See Final Details"}
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push(`/owner/services/${params.id}/book/success`)}
                                className="bg-blue-600 text-white px-12 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                            >
                                Pay Now
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Copyright © 2025. All Rights Reserved, TailBuddies</p>
                </div>
            </div>
        </div>
    )
}
