"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
    Mic, 
    MicOff, 
    Video, 
    VideoOff, 
    Monitor, 
    MessageSquare, 
    PhoneOff, 
    ChevronLeft, 
    MoreHorizontal,
    X,
    Maximize,
    Settings,
    MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils/utils"

export default function VideoCallPage() {
    const params = useParams()
    const router = useRouter()
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [elapsedTime, setElapsedTime] = useState("13:38")

    return (
        <div className="relative w-full h-full bg-[#1A1D21] flex flex-col overflow-hidden font-inter border-[12px] border-[#0F1114]">
            
            {/* Top Bar Actions */}
            <div className="absolute top-8 right-12 z-20 flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#002B49] hover:bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 border border-white/10"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Back
                </button>
            </div>

            {/* Timer Overlay */}
            <div className="absolute top-12 left-12 z-20">
                <div className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                    <ClockIcon size={14} className="text-white/60" />
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{elapsedTime} elapsed</span>
                </div>
            </div>

            {/* Main Video Area (Remote) */}
            <div className="flex-1 flex flex-col items-center justify-center relative bg-linear-to-b from-[#252A30] to-[#1A1D21]">
                <div className="flex flex-col items-center gap-10 animate-in zoom-in duration-700">
                    <div className="w-56 h-56 rounded-full bg-emerald-600 flex items-center justify-center text-7xl font-black text-white shadow-[0_0_80px_rgba(16,185,129,0.2)] ring-[16px] ring-emerald-500/10">
                        JS
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">John Smith</h2>
                </div>

                {/* Local Video Inset (Full Box matching Image 3) */}
                <div className="absolute bottom-24 right-12 w-80 aspect-video bg-[#2D333B] rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-[12px] ring-black/20 group">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50">
                        <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-xl font-black text-white ring-8 ring-emerald-500/10">
                            You
                        </div>
                        <p className="mt-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Your Video</p>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white"><Maximize size={14} /></button>
                    </div>
                </div>
            </div>

            {/* Control Strip (matching Image 3 white/gray bar) */}
            <div className="h-28 bg-[#F8FAFC] flex items-center justify-center relative z-30">
                <div className="flex items-center gap-6">
                    <ControlRoundButton 
                        icon={isMuted ? MicOff : Mic} 
                        onClick={() => setIsMuted(!isMuted)} 
                        active={!isMuted} 
                    />
                    <ControlRoundButton 
                        icon={isCameraOff ? VideoOff : Video} 
                        onClick={() => setIsCameraOff(!isCameraOff)} 
                        active={!isCameraOff} 
                    />
                    <ControlRoundButton icon={Monitor} />
                    <ControlRoundButton icon={MessageCircle} />
                    <button 
                        onClick={() => router.back()}
                        className="w-16 h-16 bg-[#F43F5E] hover:bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-rose-200 transition-all active:scale-90 hover:rotate-90 group"
                    >
                        <PhoneOff size={28} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Info Footer Strip (Matching Image 3 Green Bar) */}
            <div className="h-20 bg-[#15803D] flex items-center justify-between px-16 z-40">
                <div className="flex items-center gap-8 text-white">
                    <InfoItem label="With" value="John Smith" />
                    <div className="h-6 w-px bg-white/20" />
                    <InfoItem label="Type" value="Proposal Interview" />
                    <div className="h-6 w-px bg-white/20" />
                    <InfoItem label="Time" value="2:00 PM – 2:30 PM" />
                </div>

                <div className="flex items-center gap-4 text-white">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">{elapsedTime} elapsed</span>
                </div>
            </div>

        </div>
    )
}

function ControlRoundButton({ icon: Icon, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 border",
                active 
                    ? "bg-white text-gray-400 border-gray-100 shadow-xl shadow-gray-100" 
                    : "bg-gray-100 text-gray-600 border-gray-200 shadow-inner"
            )}
        >
            <Icon size={22} strokeWidth={2.5} />
        </button>
    )
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">{label}:</span>
            <span className="text-sm font-black whitespace-nowrap tracking-wider">{value}</span>
        </div>
    )
}

function ClockIcon({ size, className }: any) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
