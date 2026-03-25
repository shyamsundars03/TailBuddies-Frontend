"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Calendar, Clock, PawPrint, ChevronRight, Home, List } from "lucide-react"
import { motion } from "framer-motion"

export default function BookingSuccessPage() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const appId = searchParams.get("appId")
    const [bookingData, setBookingData] = useState<any>(null)

    useEffect(() => {
        const storedData = sessionStorage.getItem("bookingData")
        if (storedData) {
            setBookingData(JSON.parse(storedData))
            // Clear session storage after successful booking to prevent re-submission
            // sessionStorage.removeItem("bookingData") 
        }
    }, [])

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden"
            >
                {/* Success Header */}
                <div className="bg-emerald-500 p-12 text-center relative overflow-hidden">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="relative z-10 inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6"
                    >
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                    <h1 className="relative z-10 text-3xl font-black text-white uppercase tracking-wider mb-2">Booking Confirmed!</h1>
                    <p className="relative z-10 text-emerald-50 font-bold opacity-90">Your appointment has been successfully scheduled.</p>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-600 rounded-full blur-2xl opacity-30" />
                </div>

                <div className="p-8 md:p-12">
                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Appointment Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Date</p>
                                        <p className="text-sm font-bold text-gray-900">{bookingData?.date || "TBD"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Time Slot</p>
                                        <p className="text-sm font-bold text-gray-900">{bookingData?.timeSlot || "TBD"}</p>
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
                                    <p className="text-sm font-bold text-gray-900 truncate">{bookingData?.petName || "Selected Pet"}</p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{bookingData?.appointmentType || "Normal"} Consultation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order ID & ID Section */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-12 flex items-center justify-between border border-dashed border-gray-200">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Appointment Reference</p>
                            <p className="text-lg font-black text-[#002B49] tracking-widest">AptID: {appId || id?.slice(-8).toUpperCase() || "CONFIRMED"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Reserved</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            href="/owner/bookings" 
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#002B49] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#001B39] transition shadow-lg active:scale-[0.98]"
                        >
                            <List size={18} /> View All Appointments
                        </Link>
                        <Link 
                            href="/owner/home" 
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#002B49] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition border-2 border-gray-100 active:scale-[0.98]"
                        >
                            <Home size={18} /> Back to Home
                        </Link>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                        A confirmation email has been sent to your registered address. <br/>
                        Please arrive 10 minutes prior to your appointment time.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
