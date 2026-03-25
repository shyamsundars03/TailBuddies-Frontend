"use client"

import { useState, useRef, useEffect } from "react"
import { 
    Mic, 
    Send, 
    MoreVertical, 
    ChevronLeft, 
    ChevronRight, 
    Star, 
    Calendar,
    Minus,
    X,
    Maximize2
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

interface Message {
    id: string
    sender: "bot" | "user"
    text?: string
    timestamp: string
    options?: string[]
    doctors?: Doctor[]
    carePlan?: CarePlan
}

interface Doctor {
    id: string
    name: string
    specialty: string
    rating: number
    fees: number
    image: string
    location: string
    time: string
    available: boolean
}

interface CarePlan {
    title: string
    duration: string
    tasks: string[]
}

export function AiAssistant({ 
    isPopup = false, 
    onMinimize, 
    onClose 
}: { 
    isPopup?: boolean
    onMinimize?: () => void
    onClose?: () => void
}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "bot",
            text: "How can I help your pet today?",
            timestamp: "9:45 AM",
            options: ["Skin Issues", "Digestion", "Dental", "Emergency", "Unsure"]
        }
    ])
    const [inputText, setInputText] = useState("")

    return (
        <div className={cn(
            "flex flex-col bg-white overflow-hidden",
            isPopup ? "fixed bottom-4 right-4 w-[450px] h-[600px] rounded-3xl shadow-2xl z-50 border border-gray-100" : "h-full rounded-[2rem] border border-gray-100 shadow-sm"
        )}>
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    {isPopup && (
                         <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                            <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
                        </div>
                    )}
                    {!isPopup && (
                        <h1 className="text-xl font-black text-[#002B49] uppercase tracking-tight">AI - ASSISTENT</h1>
                    )}
                    {isPopup && (
                         <div>
                            <h3 className="font-black text-[#002B49] text-sm">TAILBUDDIES</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isPopup ? (
                        <>
                            <button onClick={onMinimize} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                                <X size={18} strokeWidth={3} />
                            </button>
                        </>
                    ) : (
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                            <MoreVertical size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                <div className="flex justify-center">
                    <span className="px-4 py-1.5 bg-blue-50/50 rounded-full text-[10px] font-black text-blue-600/80 uppercase tracking-widest">Today, March 25</span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className="space-y-6">
                        {/* Bot Message Label */}
                        {msg.sender === "bot" && (
                            <div className="flex items-start gap-3 scale-95 origin-left">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-1.5 shrink-0 border border-gray-50">
                                    <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black text-[#002B49] uppercase tracking-wider">TAILBUDDIES</span>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{msg.timestamp}</span>
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-[8px]">✓</span>
                                        </div>
                                    </div>
                                    {msg.text && (
                                        <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%]">
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">"{msg.text}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        {msg.options && (
                            <div className="flex flex-wrap gap-2.5 pl-12">
                                {msg.options.map((opt) => (
                                    <button 
                                        key={opt}
                                        className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Doctor Cards */}
                        {msg.doctors && (
                            <div className="pl-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {msg.doctors.map((doc) => (
                                    <div key={doc.id} className="min-w-[280px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                                        <div className="relative h-40">
                                            <Image src={doc.image} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                {doc.rating.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{doc.specialty}</span>
                                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Available</span>
                                                </div>
                                                <h4 className="font-extrabold text-[#002B49] text-base">{doc.name}</h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mt-1">
                                                    <span>📍 {doc.location}</span>
                                                    <span>•</span>
                                                    <span>⏱ {doc.time}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Consultation Fees</span>
                                                    <div className="text-lg font-black text-rose-500/90">${doc.fees}</div>
                                                </div>
                                                <button className="bg-[#002B49] hover:bg-blue-900 text-white text-[10px] font-black px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-50 gap-4 shrink-0">
                <div className="flex items-center gap-4">
                     <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                        <MoreVertical size={20} />
                    </button>
                    <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                        <Mic size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text"
                            placeholder="Type your message here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full pl-6 pr-12 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all text-black"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-90">
                            <Send size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
