"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, PhoneOff, ChevronLeft, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils/utils"

export default function VideoCallPage() {
    const params = useParams()
    const router = useRouter()
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [elapsedTime, setElapsedTime] = useState("13:38")

    return (
        <div className="relative w-full h-full bg-[#1A1D21] flex flex-col overflow-hidden font-inter">
            
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-20">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-black uppercase tracking-[0.2em]">{elapsedTime} elapsed</span>
                </div>

                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all border border-white/10"
                >
                    <ChevronLeft size={16} strokeWidth={3} />
                    Back
                </button>
            </div>

            {/* Main Video Area (Remote) */}
            <div className="flex-1 flex items-center justify-center relative">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-48 h-48 rounded-full bg-emerald-600 flex items-center justify-center text-6xl font-black text-white shadow-2xl ring-8 ring-emerald-500/20">
                        JS
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">John Smith</h2>
                </div>

                {/* Local Video Inset (Bottom Right) */}
                <div className="absolute bottom-32 right-8 w-64 aspect-video bg-slate-800 rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden group">
                    <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                        <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-xl font-black text-white ring-4 ring-emerald-500/20">
                            You
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Your Video</p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
                <ControlButton 
                    icon={isMuted ? MicOff : Mic} 
                    active={!isMuted} 
                    onClick={() => setIsMuted(!isMuted)} 
                    danger={isMuted}
                />
                <ControlButton 
                    icon={isCameraOff ? VideoOff : Video} 
                    active={!isCameraOff} 
                    onClick={() => setIsCameraOff(!isCameraOff)} 
                    danger={isCameraOff}
                />
                <ControlButton icon={Monitor} />
                <ControlButton icon={MessageSquare} />
                <button 
                    onClick={() => router.back()}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/20 transition-all active:scale-90 hover:rotate-90"
                >
                    <PhoneOff size={28} />
                </button>
            </div>

            {/* Info Footer Strip (Matching Image 4 Green Bar) */}
            <div className="h-16 bg-emerald-600 flex items-center justify-between px-12 z-40">
                <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase opacity-60">With:</span>
                        <span className="text-sm font-black whitespace-nowrap">John Smith</span>
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase opacity-60">Type:</span>
                        <span className="text-sm font-black whitespace-nowrap">Proposal Interview</span>
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase opacity-60">Time:</span>
                        <span className="text-sm font-black whitespace-nowrap">2:00 PM – 2:30 PM</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-widest">{elapsedTime} elapsed</span>
                </div>
            </div>

        </div>
    )
}

function ControlButton({ icon: Icon, active = false, onClick, danger = false }: { icon: any; active?: boolean; onClick?: () => void; danger?: boolean }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 border",
                active 
                    ? "bg-white/10 text-white border-white/20 hover:bg-white/20" 
                    : danger 
                        ? "bg-red-500/20 text-red-500 border-red-500/40 hover:bg-red-500/30"
                        : "bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700"
            )}
        >
            <Icon size={22} />
        </button>
    )
}
