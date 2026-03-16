"use client"

import { CheckCircle2, Calendar, FileText, ArrowRight, Share2, Download } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function BookingSuccessPage() {
    const params = useParams()

    return (
        <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-6 -mt-8 -mx-8">
            <div className="max-w-md w-full bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-500 p-10 flex flex-col items-center justify-center text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 animate-bounce">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-[0.2em] relative z-10">Success!</h1>
                    <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-2 relative z-10">Appointment has been booked</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span>Appointment ID</span>
                            <span className="text-blue-900 font-black">#TB-982341</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span>Date & Time</span>
                            <span className="text-blue-900 font-black">11 Nov 2025, 10:00 AM</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span>Pet Name</span>
                            <span className="text-blue-900 font-black">Bruno</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all">
                            <Download size={14} />
                            Receipt
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all">
                            <Share2 size={14} />
                            Share
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/owner/services"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 px-6 py-4 rounded-md text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            Back To Service
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/owner/bookings"
                            className="w-full bg-blue-950 hover:bg-blue-900 text-white flex items-center justify-center gap-3 px-6 py-4 rounded-md text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                            View My Bookings
                            <FileText size={16} />
                        </Link>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">A confirmation email has been sent to your registered address</p>
                </div>
            </div>
        </div>
    )
}
